var blocks = [];
var subblocks = [];

const blockGrowPercent = 30;
const subblockGrowPercent = 40;
const growSubHolder = true;
const marginSize = "10px";




var Block = function(element, hasContent, sizeChangeDim){
	this.e = element;
	this.style = this.e.style;
	this.setDim = function(perc){
		this.e.style[sizeChangeDim] = "calc(" + perc + "%" + " - " + (parseInt(marginSize)*2) + "px)";
	};
	this.sizeChangeDim = sizeChangeDim;
	this.showpiece = this.e.parentElement.id === "holder";
	this.hasContent = hasContent;
	Object.seal(this);
}




function adjustWidth(blocks, index, bigPerc = -1){
	if(bigPerc === -1)
		bigPerc = 100 / blocks.length;
	var smallPerc = (100 - bigPerc) / (blocks.length - 1);
	for(var i in blocks)
		blocks[i].setDim((i == index) ? bigPerc : smallPerc);
}


function adjustBigHeights(head, hold, foot){
	document.querySelector("#header").style.height = head;
	document.querySelector("#holder").style.height = hold;
	document.querySelector("footer").style.height = foot;
}




function setUpMouseOver(){

	subblocks.forEach(function(b){
		b.style.width = "100%";
		b.style.height = 100/subblocks.length + "%";
	});

	var allBlocks = blocks.concat(subblocks);

	for(let n = 0; n < allBlocks.length; ++n){
		let b = allBlocks[n];
		b.style.margin = marginSize;
		if(b.showpiece)
			b.setDim(100/blocks.length);

		b.e.onmouseenter = function(){
			if(b.showpiece){
				if(!b.hasContent && !growSubHolder)
					adjustWidth(blocks, n);
				else
					adjustWidth(blocks, n, blockGrowPercent);
			}
			else{
				adjustWidth(subblocks, n - blocks.length, subblockGrowPercent);
			}
			if(b.hasContent){
				b.e.querySelector('.preview').style.width = "90%";
			}
		}

		b.e.onmouseleave = function(){
			if(b.showpiece)
				adjustWidth(blocks, n);
			else
				adjustWidth(subblocks, n - blocks.length);
			if(b.hasContent)
				b.e.querySelector('.preview').style.width = 0;
		}

		if(b.hasContent){
			b.e.onclick = function(){
				clickOpen(allBlocks, n);
				b.e.querySelector('.preview').style.width = 0;
			}
		}
	}
	adjustBigHeights("", "", "");
}




function addPreviewTitle(block){
	var preview = document.createElement("SECTION");
	preview.className = "preview";

	var title = document.createElement("SECTION");
	title.className = "title";
	title.innerHTML = block.querySelector('.title').innerHTML;
	preview.appendChild(title);

	var blurb = document.createElement("SECTION");
	blurb.className = "blurb";
	blurb.innerHTML = block.querySelector('.blurb').innerHTML;
	preview.appendChild(blurb);

	if(block.parentElement.id === "holdersub"){
		preview.style.height = "100%";
		title.style.height = "50%";
		var image = title.querySelector("img");
		image.style.maxHeight = "100%";
		image.style.maxWidth = "100%";
		image.style.height = "auto";
		image.style.width = "auto";
	}

	block.appendChild(preview);
}




function makeGallery(block){
	var images = block.querySelectorAll('.gallery img');

	let imageLinks = [];

	for(let n = 0; n < images.length; ++n){
		let i = images[n];
		let iLink = images[n].outerHTML.split('"')[1];
		imageLinks.push(iLink);
	}


	if(imageLinks.length > 1){

		var leftButton = document.createElement("BUTTON");
		leftButton.value = -1;
		leftButton.className = "galleryControl galleryLeft";
		leftButton.innerHTML = "<"
		var rightButton = document.createElement("BUTTON");
		rightButton.value = 1;
		rightButton.className = "galleryControl galleryRight";
		rightButton.innerHTML = ">";

		var controls = document.createElement("SECTION");
		controls.appendChild(leftButton);
		controls.appendChild(rightButton);
		block.querySelector(".content").appendChild(controls);

		function imageCycle(e){
			let bgl = block.style.backgroundImage.split('"')[1];
			let index = imageLinks.indexOf(bgl);
			index += parseInt(e.target.value);
			if(index >= imageLinks.length)
				index = 0;
			if(index < 0)
				index = imageLinks.length - 1;
			block.style.backgroundImage = "url(" + imageLinks[index] + ")";
		};

		leftButton.onclick = imageCycle;
		rightButton.onclick = imageCycle;
	}
	
}




function initBlocks(){
	var allBlocks = blocks.concat(subblocks);
	for(let n = 0; n < allBlocks.length; ++n){
		let b = allBlocks[n];
		if(b.hasContent === true){
			addPreviewTitle(b.e);
			makeGallery(b.e);
			let c = b.e.querySelector(".content");
			let x = c.querySelector(".x");
			x.onclick = function(e){
				e.stopPropagation();
				setUpMouseOver();
				c.hidden = true;
				b.style.cursor = "pointer";
			};
			c.hidden = true;
		}
	}
}




function clickOpen(blocks, index){
	for(let n = 0; n < blocks.length; ++n){
		let b = blocks[n];
		if(b.showpiece)
			b.style.width = (n === index) ? "100%" : "0%";
		else{
			if(blocks[index].showpiece === false)
				b.style.height = (n === index) ? "100%" : "0%";
			if(n === index)
				document.querySelector("#holdersub").style.width = "100%";
		}
		b.style.margin = "";
		b.e.onmouseenter = function(){};
		b.e.onmouseleave = function(){};
		b.e.onclick = function(){};
		b.style.cursor = (n === index) ? "auto" : "pointer";
		b.e.querySelector(".content").hidden = (n === index) ? false : true;
	}
	adjustBigHeights("0", "100%", "0");
}






function addEmail(){
	// Adds email in a safe way

	// this isn't needed right now
	return;

	var aboutMe = document.querySelector("#header");
	if(aboutMe != null)
		aboutMe.innerHTML += "<p>alexanderearley" + "@" + "verizon.net</p>";
}



window.onload = function(){
	createBlocks();
	addEmail();
	document.querySelector("#loading").hidden = true;
	document.querySelector("#holder").style.display = "block";
	initBlocks();
	setUpMouseOver();
}







var createBlocks = function(){
	var baseBlock = document.querySelector(".block");
	var holder = document.querySelector("#holder");
	var subholder = document.createElement("div");
	subholder.className = "block";
	subholder.id = "holdersub";


	content.forEach(function(block){

		var newNode = baseBlock.cloneNode(true);

		var title = newNode.querySelector(".title");
		var titleImg = newNode.querySelector(".titleImage");
		var blurb = newNode.querySelector(".blurb");
		var controls = newNode.querySelector(".controls");
		var info = newNode.querySelector(".info");
		var year = newNode.querySelector(".year");
		var link = newNode.querySelector(".gameLinks");
		var gallery = newNode.querySelector(".gallery");

		if(block.titleImage)
			titleImg.src = block.titleImage;
		else {
			titleImg.parentElement.removeChild(titleImg);
			title.innerHTML = block.title;
		}

		blurb.innerHTML = block.blurb;

		if(block.controls.length === 0)
			controls.parentElement.removeChild(controls);
		else {
			var list = controls.querySelector("ul");
			block.controls.forEach(function(line){
				var li = document.createElement('li');
				li.innerHTML = line;
				list.appendChild(li);
			});
		}

		year.innerHTML = block.year;

		for(var key in block.links){
			var li = link.cloneNode(true);
			li.querySelector("a").href = block.links[key];
			li.querySelector("a").innerHTML = key;
			link.parentElement.appendChild(li);
		}
		link.parentElement.removeChild(link);

		block.info = block.info.split("\n");
		block.info.forEach(function(line){
			info.innerHTML += "<p>" + line + "</p>";
		})

		block.images.forEach(function(img){
			var i = document.createElement("img");
			i.src = img;
			i.classList.remove("galleryImage")
			gallery.appendChild(i);
		});

		newNode.style.backgroundPositionX = block.backgroundImagePosition;
		newNode.style.backgroundImage = 'url("' + block.images[0] + '")';

		if(block.showpiece){
			holder.appendChild(newNode);
			blocks.push(new Block(newNode, true, "width"));
		}
		else{
			subholder.appendChild(newNode);
			subblocks.push(new Block(newNode, true, "height"));
		}

	});

	if(subblocks.length > 0){
		holder.appendChild(subholder);
		blocks.push(new Block(subholder, false, "width"));
	}

	baseBlock.parentElement.removeChild(baseBlock);
}