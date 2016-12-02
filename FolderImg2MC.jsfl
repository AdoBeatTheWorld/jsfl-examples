fl.outputPanel.clear();
var doc = fl.getDocumentDOM();
var lib = doc.library;
var list = lib.items;
var len = list.length;
var item;
var foldItems = [];

var folderDict = {};
var folderKeys = [];
var itemName;
var folderName;
var totalFolder;
for(var i = 0; i < len; i++){
	item = list[i];
	itemName = item.name;
	
	if(item.itemType == "bitmap"){
		if( itemName.indexOf("/") != - 1){
			folderName = itemName.split("/")[0];
			if( folderKeys.indexOf(folderName) == -1 ){
				folderKeys.push(folderName);
				folderDict[folderName] = [item];
			}else{
				folderDict[folderName].push(item);
			}
		}
	}
}
totalFolder = folderKeys.length;

while( folderKeys.length != 0 ){
	createMc(folderKeys.pop());
}

function createMc(itemName){
	lib.addNewItem("movie clip",itemName+"_mc");
	lib.selectItem(itemName+"_mc");
	var index = lib.findItemIndex(itemName+"_mc");
	if( index != - 1){
		var newItem = lib.items[index];
		var imgs = folderDict[itemName];
		
		imgs.sort(function(item0, item1){
			var index0 = parseInt(item0.name.split("/")[1].split(".")[0]);
			var index1 = parseInt(item1.name.split("/")[1].split(".")[0]);
			return index0 > index1 ? 1 : -1;
		});
		
		lib.editItem(newItem.name);
		var timeline = newItem.timeline;
		fl.trace(newItem + ":"+ newItem.timeline);
		for(var i = 0 ; i < imgs.length; i++){
			if( i != 0 ){ 
				timeline.insertBlankKeyframe(i);
			}
			doc.addItem({x:0,y:0},imgs[i]);
			fl.trace("Progressing ----- "+folderKeys.length+"/"+totalFolder+" : "+i+"/"+imgs.length);
		}
	}
}
