fl.outputPanel.clear();

var rootPath = "file:///D|/folder/"
autoexcute();

function autoexcute()
{
	parseDirectory(rootPath)
	fl.trace("done...");
}

function parseDirectory(dirpath)
{
	var fileList = FLfile.listFolder(dirpath+"/*.fla","files");
	try{
		var len=fileList.length;
		for(var i=0; i<len; i++)
		{
			excute(fileList[i],dirpath);
		}
	}catch(e){
		fl.trace("error...."+e)
	}
	
	var files = FLfile.listFolder(dirpath,"directories");
	fl.trace("Directory....."+dirpath+"...."+files.length+"...."+files.join("+"))
	if(files && files.length)
	{
		for each(doc in files)
		{
			parseDirectory(dirpath+"/"+doc)
		}
	}
}

function excute(file,dirpath)
{
	var folderURI = "file:///D|/images/"+file.split(".")[0];
	fl.trace("Excuting ...."+dirpath+"/"+file)
	/***/
	fl.openDocument(dirpath+"/"+file);
	var lib = fl.getDocumentDOM().library;//获取flash中的库
	lib.selectAll();
	var items = lib.getSelectedItems();//获取库项目数组
	//循环比例库项目
	var currentFolder = '';
	for(var i=0;i<items.length;i++)
	{
		//判断类型，如果是图片就导出
		if(items[i].itemType == "bitmap")
		{
			var linkageClassName = items[i].linkageClassName;
			var itemName = items[i].name;//获取库项目全部名称
			
			var useLikeClassToPath = ( linkageClassName != null );
			if( useLikeClassToPath == true )//是否根据类名
			{	
				var name_preFolder = itemName.substring(0,itemName.indexOf("/"));
				var link_preFolder = linkageClassName.substring(0,itemName.indexOf("/"));
				//fl.trace("类名与文件夹是否对应的:: ---- " + name_preFolder + "=============" + link_preFolder);
				useLikeClassToPath = ( name_preFolder == link_preFolder )
				if( useLikeClassToPath == true )
				{
					var fileType = itemName.substring(itemName.lastIndexOf("."),itemName.length)
					var eName= linkageClassName.substring(linkageClassName.lastIndexOf(".") + 1, linkageClassName.length);//获取本身的名称
					var tempFolder = linkageClassName.replace(/\./g,'/');
					tempFolder = tempFolder.substring(0,tempFolder.lastIndexOf("/"));
					var folderUrl = folderURI + "/"+ tempFolder;
					if( fileType!= ".png" || fileType != ".jpg")
					{
						var sourceFilePath = items[i].sourceFilePath ;
						
						fileType = sourceFilePath.substring(sourceFilePath.lastIndexOf("."),sourceFilePath.length);
						if( fileType!= ".png" || fileType != ".jpg")
						{
							fileType = ".png";
						}
					}
					//fl.trace("itemName by link::: ---- " + itemName);
					if(currentFolder != folderUrl)
					{
						currentFolder = folderUrl;
						FLfile.createFolder(folderUrl);
					}
					
					items[i].exportToFile(folderUrl+"/" +eName+fileType);//导出图片,如果是bitmap类型，有exportToFile方法导出
				}
			}
			if( useLikeClassToPath == false )
			{
				//fl.trace("itemName by name::: ---- " + itemName);
				
				var eName= itemName.substring(itemName.lastIndexOf("/") + 1, itemName.length);//获取本身的名称
				eName= itemName.substring(itemName.lastIndexOf("\\") + 1, itemName.length);
				
				var folderUrl = folderURI + "/"+itemName.substring(0, itemName.lastIndexOf("/"));
				if(currentFolder != folderUrl)
				{
					currentFolder = folderUrl;
					FLfile.createFolder(folderUrl);
				}
				var exportUrl = folderUrl+"/" +eName;	
				
				var sourceFilePath = items[i].sourceFilePath ;		
				var	fileType = sourceFilePath.substring(sourceFilePath.lastIndexOf("."),sourceFilePath.length);
				if( fileType!= ".png" || fileType != ".jpg")
				{
					fileType = ".png";
				}
				if(exportUrl.indexOf(fileType)==-1)
				{
					exportUrl = exportUrl + fileType;
				}
				items[i].exportToFile(exportUrl);//导出图片,如果是bitmap类型，有exportToFile方法导出
			}
		}

	}/***/
	fl.closeDocument(dirpath+"/"+file);
}

