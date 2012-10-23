var list = fl.getDocumentDOM().library.items;
var len = list.length;
var prefix = fl.getDocumentDOM().path;
for(var i=0; i < len; i++)
{
	if(list[i].itemType == "bitmap")
	{
		var _temp = prefix.replace(fl.getDocumentDOM().name,list[i].name);
		_temp = FLfile.platformPathToURI(_temp);
		list[i].exportToFile(_temp);
	}
}