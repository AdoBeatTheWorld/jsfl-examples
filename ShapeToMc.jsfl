fl.outputPanel.clear();
var lib = fl.getDocumentDOM().library;
var list = lib.items;
var len = list.length;
for(var i = 0; i < len; i++)
{
	var item = list[i];
	var itemName = item.name;
	if( (item.linkageBaseClass == null || item.linkageBaseClass == "") && item.itemType != "folder" )
	{
		var tempItemClass = getName(item);
		
		if( item.symbolType == "graphic" )
		{
			item.symbolType = "movie clip";
		}
		if( item.itemType == "movie clip" && typeof(item.linkageClassName) == "undefined" )
		{
			item.linkageExportForAS = true;
			item.linkageExportInFirstFrame  = true;
			item.linkageBaseClass = "flash.display.MovieClip";
			item.linkageClassName = tempItemClass;
			fl.trace("Exported ====> " + item.name);
		}
	}
}

function getName(item)
{
	var tempName = item.name;
	if( tempName.indexOf("/") != -1)
	{
		var tempArr = tempName.split("/");
		tempName = tempArr[tempArr.length-1];
	}
	
	if( tempName.indexOf( "\b" ) != -1)
	{
		tempName = tempName.replace("\b","");
	}
	
	if( tempName.indexOf( "\t" ) != -1)
	{
		tempName = tempName.replace("\t","");
	}
	
	if( tempName.indexOf( " " ) != -1)
	{
		tempName = tempName.replace(" ","");
	}
	return tempName;
}
