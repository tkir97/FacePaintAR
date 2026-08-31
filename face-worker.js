let FaceLandmarker=null;
let FilesetResolver=null;
let landmarker=null;
let currentDelegate="CPU";
let initialized=false;
let activeOptions={};

const PACKAGE_URL="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm";
const WASM_ROOT="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
const MODEL_URL="https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

async function loadMediaPipe(){
  if(FaceLandmarker&&FilesetResolver)return;

  // This worker is intentionally a CLASSIC worker.
  // Dynamic import gives us the ESM exports, while MediaPipe's own internal
  // importScripts() calls remain legal because WorkerGlobalScope is classic.
  const vision=await import(PACKAGE_URL);
  FaceLandmarker=vision.FaceLandmarker;
  FilesetResolver=vision.FilesetResolver;

  if(!FaceLandmarker||!FilesetResolver){
    throw new Error("MediaPipe FaceLandmarker exports were not found.");
  }
}

async function createLandmarker(delegate,options){
  await loadMediaPipe();

  const vision=await FilesetResolver.forVisionTasks(WASM_ROOT);
  return FaceLandmarker.createFromOptions(vision,{
    baseOptions:{
      modelAssetPath:MODEL_URL,
      delegate
    },
    runningMode:"VIDEO",
    numFaces:1,
    minFaceDetectionConfidence:options.minFaceDetectionConfidence ?? .6,
    minFacePresenceConfidence:options.minFacePresenceConfidence ?? .6,
    minTrackingConfidence:options.minTrackingConfidence ?? .55,
    outputFaceBlendshapes:options.outputFaceBlendshapes ?? true,
    outputFacialTransformationMatrixes:options.outputFacialTransformationMatrixes ?? true
  });
}

async function initialize(options={}){
  activeOptions=options;
  if(landmarker){
    try{landmarker.close()}catch{}
    landmarker=null;
  }

  const preferred=options.delegate==="CPU"?"CPU":"GPU";

  try{
    landmarker=await createLandmarker(preferred,options);
    currentDelegate=preferred;
  }catch(gpuError){
    if(preferred==="CPU")throw gpuError;
    console.warn("Worker GPU delegate failed; falling back to CPU.",gpuError);
    landmarker=await createLandmarker("CPU",options);
    currentDelegate="CPU";
  }

  initialized=true;
  self.postMessage({type:"READY",delegate:currentDelegate});
}

function flattenPoseMatrix(result){
  const matrices=result?.facialTransformationMatrixes||[];
  if(!matrices.length)return null;
  const data=matrices[0]?.data||matrices[0];
  if(!data||data.length<16)return null;
  return new Float32Array(Array.from(data).slice(0,16));
}
function serializeBlendshapes(result){
  const sets=result?.faceBlendshapes||[];
  if(!sets.length)return null;
  const out={};
  for(const c of sets[0]?.categories||[]){
    if(c?.categoryName)out[c.categoryName]=c.score||0;
  }
  return out;
}
function flattenFirstFace(result){
  const faces=result?.faceLandmarks||[];
  if(!faces.length)return null;

  const face=faces[0];
  const flat=new Float32Array(468*3);

  for(let i=0;i<468;i++){
    const p=face[i];
    const j=i*3;
    flat[j]=p?.x||0;
    flat[j+1]=p?.y||0;
    flat[j+2]=p?.z||0;
  }

  return flat;
}

self.onmessage=async(event)=>{
  const data=event.data||{};

  if(data.type==="INIT"){
    try{
      await initialize(data.options||{});
    }catch(err){
      console.error("Worker initialization failed",err);
      self.postMessage({
        type:"ERROR",
        error:err?.message||String(err)
      });
    }
    return;
  }

  if(data.type==="DETECT"){
    const bitmap=data.bitmap;
    if(!bitmap)return;

    if(!initialized||!landmarker){
      try{bitmap.close()}catch{}
      self.postMessage({
        type:"ERROR",
        error:"Worker landmarker is not initialized."
      });
      return;
    }

    const start=performance.now();

    try{
      const result=landmarker.detectForVideo(bitmap,data.timestampMs);
      const inferenceMs=performance.now()-start;
      const landmarks=flattenFirstFace(result);
      const pose=activeOptions.outputFacialTransformationMatrixes===false?null:flattenPoseMatrix(result);
      const blendshapes=activeOptions.outputFaceBlendshapes===false?null:serializeBlendshapes(result);

      try{bitmap.close()}catch{}

      if(landmarks){
        const transfers=[landmarks.buffer];
        if(pose)transfers.push(pose.buffer);
        self.postMessage({
          type:"RESULT",
          inferenceMs,
          captureSentAt:data.captureSentAt,
          landmarks:landmarks.buffer,
          poseMatrix:pose?pose.buffer:null,
          blendshapes
        },transfers);
      }else{
        self.postMessage({
          type:"RESULT",
          inferenceMs,
          landmarks:null
        });
      }
    }catch(err){
      try{bitmap.close()}catch{}
      self.postMessage({
        type:"ERROR",
        error:err?.message||String(err)
      });
    }
  }
};
