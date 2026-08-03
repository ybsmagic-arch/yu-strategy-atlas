export type HerbCatalogItem={code:string;name:string};
export type HerbSubcategory={code:string;name:string;items?:HerbCatalogItem[]};
export type HerbChapter={code:string;number:number;name:string;subcategories:HerbSubcategory[]};
const warm:HerbCatalogItem[]=[
  ["HERB-MAHUANG","麻黃"],["HERB-GUIZHI","桂枝"],["HERB-ZISUYE","紫蘇葉"],["HERB-SHENGJIANG","生薑"],["HERB-XIANGRU","香薷"],["HERB-JINGJIE","荊芥"],["HERB-FANGFENG","防風"],["HERB-QIANGHUO","羌活"],["HERB-BAIZHI","白芷"],["HERB-XIXIN","細辛"],["HERB-GAOBEN","藁本"],["HERB-CANGERZI","蒼耳子"],["HERB-XINYI","辛夷"],["HERB-CONGBAI","蔥白"],
].map(([code,name])=>({code,name}));
const cool:HerbCatalogItem[]=[
  ["HERB-BOHE","薄荷"],["HERB-NIUBANGZI","牛蒡子"],["HERB-CHANTUI","蟬蛻"],["HERB-SANGYE","桑葉"],["HERB-JUHUA","菊花"],["HERB-MANJINGZI","蔓荊子"],["HERB-CHAIHU","柴胡"],["HERB-SHENGMA","升麻"],["HERB-GEGEN","葛根"],["HERB-DANDOUCHI","淡豆豉"],["HERB-FUPING","浮萍"],["HERB-MUZEI","木賊"],
].map(([code,name])=>({code,name}));
const sub=(chapter:number,index:number,name:string,items?:HerbCatalogItem[]):HerbSubcategory=>({code:`HERB-CAT-${String(chapter).padStart(2,"0")}-${String(index).padStart(2,"0")}`,name,items});
export const generalHerbCatalog:HerbChapter[]=[
 {code:"HERB-CAT-01",number:1,name:"解表藥",subcategories:[sub(1,1,"辛溫解表藥",warm),sub(1,2,"辛涼解表藥",cool)]},
 {code:"HERB-CAT-02",number:2,name:"清熱藥",subcategories:[sub(2,1,"清熱瀉火藥"),sub(2,2,"清熱燥濕藥"),sub(2,3,"清熱解毒藥"),sub(2,4,"清熱涼血藥"),sub(2,5,"清虛熱藥")]},
 {code:"HERB-CAT-03",number:3,name:"瀉下藥",subcategories:[sub(3,1,"攻下藥"),sub(3,2,"潤下藥"),sub(3,3,"峻下逐水藥")]},
 {code:"HERB-CAT-04",number:4,name:"祛風濕藥",subcategories:[sub(4,1,"祛風寒濕藥"),sub(4,2,"祛風濕熱藥"),sub(4,3,"祛風濕、強筋骨藥")]},
 {code:"HERB-CAT-05",number:5,name:"化濕藥",subcategories:[]},
 {code:"HERB-CAT-06",number:6,name:"利水滲濕藥",subcategories:[sub(6,1,"利水消腫藥"),sub(6,2,"利尿通淋藥"),sub(6,3,"利濕退黃藥")]},
 {code:"HERB-CAT-07",number:7,name:"溫裏藥",subcategories:[]},{code:"HERB-CAT-08",number:8,name:"理氣藥",subcategories:[]},{code:"HERB-CAT-09",number:9,name:"消食藥",subcategories:[]},{code:"HERB-CAT-10",number:10,name:"驅蟲藥",subcategories:[]},
 {code:"HERB-CAT-11",number:11,name:"止血藥",subcategories:[sub(11,1,"涼血止血藥"),sub(11,2,"化瘀止血藥"),sub(11,3,"收斂止血藥"),sub(11,4,"溫經止血藥")]},
 {code:"HERB-CAT-12",number:12,name:"活血化瘀藥",subcategories:[sub(12,1,"活血止痛藥"),sub(12,2,"活血調經藥"),sub(12,3,"活血療傷藥"),sub(12,4,"破血消癥藥")]},
 {code:"HERB-CAT-13",number:13,name:"化痰止咳平喘藥",subcategories:[sub(13,1,"溫化寒痰藥"),sub(13,2,"清化熱痰藥"),sub(13,3,"止咳平喘藥")]},
 {code:"HERB-CAT-14",number:14,name:"安神藥",subcategories:[sub(14,1,"重鎮安神藥"),sub(14,2,"養心安神藥")]},
 {code:"HERB-CAT-15",number:15,name:"平肝息風藥",subcategories:[sub(15,1,"平抑肝陽藥"),sub(15,2,"息風止痙藥")]},
 {code:"HERB-CAT-16",number:16,name:"開竅藥",subcategories:[]},
 {code:"HERB-CAT-17",number:17,name:"補虛藥",subcategories:[sub(17,1,"補氣藥"),sub(17,2,"補陽藥"),sub(17,3,"補血藥"),sub(17,4,"補陰藥")]},
 {code:"HERB-CAT-18",number:18,name:"收澀藥",subcategories:[sub(18,1,"固表止汗藥"),sub(18,2,"斂肺澀腸藥"),sub(18,3,"固精縮尿止帶藥")]},
 {code:"HERB-CAT-19",number:19,name:"涌吐藥",subcategories:[]},{code:"HERB-CAT-20",number:20,name:"攻毒殺蟲止癢藥",subcategories:[]},{code:"HERB-CAT-21",number:21,name:"拔毒化腐生肌藥",subcategories:[]},
];
export const catalogItemCount=generalHerbCatalog.flatMap(x=>x.subcategories).flatMap(x=>x.items??[]).length;
