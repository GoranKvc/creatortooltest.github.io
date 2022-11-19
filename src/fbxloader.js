import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxmodel = new Promise((res, rej) => {
    const fbxloader = new FBXLoader();
    fbxloader.load("models/DR1VER-CLOSED.fbx", function(fbxobj){
        fbxobj.traverse(function(child){
            if(child.isMesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        res(fbxobj);
    });
});

export default fbxmodel;