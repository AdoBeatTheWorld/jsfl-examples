fl.outputPanel.clear();
var lib = fl.getDocumentDOM().library;
var list = lib.items;
var len = list.length;
for(var i = 0; i < len; i++)
{
	var item = list[i];
	if( item.itemType == "movie clip" && item.linkageBaseClass != "undefined" )
	{
		fl.trace("Operationg item :" + item.name);
		var timeline = item.timeline;
		operateTimeline(timeline);
	}
}

function operateTimeline(timeline)
{
	for(var j = 0; j < timeline.layers.length; j++)
	{
		var layer = timeline.layers[j];
		
		if( layer.frameCount == 1) continue;
		
		fl.trace("layer" + j);
		for(var k = 0 ; k < layer.frameCount; k++)
		{
			var frame = layer.frames[k];
			if( frame.elements.length != 0 && k == frame.startFrame )
			{
				for( var h = 0; h < frame.elements.length; h++)
				{
					var element = frame.elements[h];
					if( element.symbolType == "graphic" )
					{
						element.symbolType = "movie clip";
					}
					fl.trace( element.name + "===>" + element.symbolType );

				}
			}
		}
	}
}
