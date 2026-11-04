// Shared by the editor and exported viewer. Asset metadata: Brain Project, CC BY-SA 4.0.
export function createBrainTools(THREE){
 const colors={cortex:'#d88782',white_matter:'#aabbd8',deep_grey:'#a86bd6',diencephalon:'#7188e6',brainstem:'#dfaa4d',cerebellum:'#e8824f',ventricles:'#38bfd0',arteries:'#e14d67',veins_sinuses:'#526fc5',cranial_nerves:'#c9bc4c',meninges_dura:'#bb73be',tracts:'#4fa9a4',other:'#b8a1aa'};
 function metadata(mesh,root){for(let o=mesh;o;o=o.parent){const d=o.userData||{};if(d.bx_id!=null||d.bx_label!=null)return d;if(o===root)break}return null}
 function prepare(root){const parts=new Map();root.traverse(mesh=>{if(!mesh.isMesh)return;const meta=metadata(mesh,root);if(!meta||meta.bx_id==null)return;const id=String(meta.bx_id);let part=parts.get(id);if(!part){part={id,label:String(meta.bx_label||'Unnamed structure'),category:String(meta.bx_cat||'other'),side:String(meta.bx_side||'') ,meshes:[]};parts.set(id,part)}part.meshes.push(mesh);mesh.userData.brainOriginalVisible=mesh.visible;const hex=colors[part.category]||colors.other;mesh.material=new THREE.MeshStandardMaterial({color:hex,roughness:.72,metalness:0,emissive:hex,emissiveIntensity:.035,side:part.category==='meninges_dura'?THREE.DoubleSide:THREE.FrontSide});});return parts}
 function fromHit(hit,root,parts){const meta=metadata(hit,root);return meta&&meta.bx_id!=null?parts.get(String(meta.bx_id))||null:null}
 function update(parts,id,isolate){for(const part of parts.values())for(const mesh of part.meshes){mesh.visible=mesh.userData.brainOriginalVisible!==false&&(!isolate||id===part.id);if(mesh.material?.emissive)mesh.material.emissiveIntensity=id===part.id?.32:.035}}
 function describe(part,descriptions){return descriptions?.[part.label]||'A detailed description for this structure is not available in the source.'}
 return {prepare,fromHit,update,describe};
}
