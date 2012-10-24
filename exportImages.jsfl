var list = fl.getDocumentDOM().library.items;
var len = list.length;
var prefix = fl.getDocumentDOM().path;
var pres = prompt("prefix need to be export",["monster","hero"]).split(",");

for(var i=0; i < len; i++)
{
	for(var j=0; j < pres.length; j++)
	{
		//fl.trace(list[i].name);
		var index = list[i].name.indexOf(pres[j]);
		if(index > -1 && list[i].linkageClassName != "")
		{	
			var _temp = prefix.replace(fl.getDocumentDOM().name,list[i].linkageClassName);
			_temp = _temp.replace(".fla",".swf");
			_temp = FLfile.platformPathToURI(_temp);
			//fl.trace(_temp);
			list[i].exportSWF(_temp);
			break;
		}
	}
}