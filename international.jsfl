var list = fl.getDocumentDOM().library.items;
var result = XML("<panels />");
var len1 = list.length;
var start_data = [];
for(i = 0; i < list.length;i++)
{
	//fl.trace(list[i].name+" : "+list[i].linkageBaseClass);
	//如果是导出的面板
	if(list[i].linkageBaseClass == "flash.display.Sprite")
	{
		parseItem(list[i],"");
	}
}
function isundefine(value){
	if(typeof(value) == "undefined"){
		return 0;
	}else{
		return value;
	}
}
function parseItem(item,appendName,layerIndex,frameIndex,elementIndex)
{
	
	//fl.trace((item.itemType == "movie clip") + " : "+ item.itemType + " : "+item.name);
	layerIndex = isundefine(layerIndex);
	frameIndex = isundefine(frameIndex);
	elementIndex = isundefine(elementIndex);
	//fl.trace("item : "+item+", appendName : "+appendName+", layerIndex : "+layerIndex+", frameIndex : "+frameIndex+", elementIndex : "+elementIndex);
	//如果是element的话，需要去library里面拿他对应的item;
	//名字需要记录，因为拿到库里面的item之后拿到的name会不一样
	//只能对item进行遍历，因为item有时间轴，element.libraryItem是其对应的item
	if(item.elementType)
	{
		//fl.trace("switch element "+item.elementType +" to "+item.libraryItem.itemType);
		var tempName = item.name;
		item = item.libraryItem;
	}else{
		tempName = item.name;
	}
	//fl.trace("tempName : " + tempName);
	//拿到面板的layers并对其进行遍历
	var len1 = item.timeline.layers.length;
	var len2;
	for(j = layerIndex; j < len1; j++)
	{
		//fl.trace("layers====j : " + j + ",len1 : " + len1);
		var layer = item.timeline.layers[j];
		len2 = layer.frames.length;
		//对本层的所有帧进行遍历
		for(k = frameIndex; k < len2; k++)
		{
			//fl.trace("frames====k : " + k + ",len2 : " + len2);
			var frame = layer.frames[k];				
			var _elements = frame.elements;
			//对帧上的元素进行遍历
			for(m = elementIndex; m < _elements.length; m++)
			{
				//fl.trace("elements====m : " + m + ",len3 : " + _elements.length + " : " + _elements[m]);
				_element = _elements[m];
				//fl.trace(_element.elementType);
				//如果elementType不是'instance', 说明他的elementType是Text, Shape或者其他无关类型
				if(_element.elementType != "instance") continue;
				
				//fl.trace("sub : " + _element.libraryItem.name);
				
				if(_element.libraryItem.itemType == "movie clip")
				{
					//如果这个不是最底层，那么对他的子进行递归
					//递归嵌套的话将临时当前数据push到数组里面去
					start_data.push({item:item,layerIndex:j,frameIndex:k,elementIndex:m+1,appendName:appendName});
					//fl.trace("PUSH DATA into array : "+start_data[0]);
					parseItem(_element,appendName+"."+tempName);
				}
				//如果_element==null的话，说明是刚跳出嵌套
				if(_element == null) continue;

				var key = getValue(_element.parameters,"key");
				//文本的可能字段
				var desc = getValue(_element.parameters,"internationValue");
				if(desc=="")
				{
					 desc = getValue(_element.parameters,"text");
				}
				
				if(desc == null)
				{
					desc = getValue(_element.parameters,"label");
				}
				
				var elementNode = XML("<element />");
				
				if(key == null){
					continue;
				}
				elementNode.@key = key;
				elementNode.@name = _element.name;
				elementNode.@desc = desc == null ? "" : desc;
				if(appendName[0]=="."){
					appendName = appendName.replace(".","");
				}
				if(appendName != "")
				{
					elementNode.@panel = appendName+"."+tempName;
				}else{
					elementNode.@panel = tempName;
				}
				//fl.trace("ADD CHILD : "+elementNode.@panel+"."+elementNode.@name);
				//清空临时数据，防止产生误解
				_element = null;
				result.appendChild(elementNode);
			}
		}
	}
	//fl.trace("NEED TRACE BACK ? "+start_data.length);
	//判断是否是在递归嵌套中
	if(start_data.length>0){
		var tempdata = start_data.pop();
		//fl.trace("TRACE BACK..."+typeof(tempdata));
		parseItem(tempdata.item,tempdata.appendName,tempdata.layerIndex,tempdata.frameIndex,tempdata.elementIndex);
	}
}
function getValue(paras,str)
{
	if(paras == null || paras.length == 0)
	{
		return null;
	}
	for(n = 0; n <paras.length; n++)
	{
		if(paras[n].name==str)
		{
			return paras[n].value;
		}
	}
	return null;
}

var docName = fl.getDocumentDOM().path;
//fl.trace("Local Path find: "+docName);
var arr = docName.split(".");
docName = arr[0]+".lang";
docName = FLfile.platformPathToURI(docName);
//fl.trace("Write config into file: "+docName);
FLfile.write(docName,result);
//fl.trace("Generate done...");