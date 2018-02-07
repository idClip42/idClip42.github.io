
var blocks;

var headerHeight = "20%";
var holderHeight = "70%";




function setUpMouseOver(){

	var widthMult = 2;
	var divider = blocks.length + widthMult - 1;
	var perc = 100/divider;

	for(let n = 0; n < blocks.length; ++n){
		let b = blocks[n];
		b.style.width = perc + "%";

		b.onmouseenter = function(){
			b.style.width = perc * widthMult + "%";
			b.querySelector('.preview').style.width = "90%";
		}

		b.onmouseleave = function(){
			b.style.width = perc + "%";
			b.querySelector('.preview').style.width = 0;
		}

		b.onclick = function(){
			clickOpen(blocks, n);
			b.querySelector('.preview').style.width = 0;
		}
	}

	document.querySelector("#header").style.height = headerHeight;
	document.querySelector("#holder").style.height = holderHeight;
	document.querySelector("footer").style.height = "auto";
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

	block.appendChild(preview);
}




function makeGallery(block){
	var images = block.querySelectorAll('.gallery img');

	let imageLinks = [];

	var bgLink = block.style.backgroundImage.split('"')[1];
	imageLinks.push(bgLink);

	for(let n = 0; n < images.length; ++n){
		let i = images[n];
		let iLink = images[n].outerHTML.split('"')[1];
		if(iLink !== bgLink)
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
		//var expText = document.createElement("DIV");
		//expText.className = "galleryControl";
		//expText.innerHTML = "Cycle Images";

		var controls = document.createElement("SECTION");
		controls.appendChild(leftButton);
		//controls.appendChild(expText);
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

	for(let n = 0; n < blocks.length; ++n){
		let b = blocks[n];

		addPreviewTitle(b);
		makeGallery(b);

		let c = b.querySelector(".content");

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




function clickOpen(blocks, index){

	//var miniWidth = 10;
	//var maxWidth = document.body.clientWidth - miniWidth * (blocks.length-1);
	//var miniWidth = 0.6;
	//var maxWidth = 100 - miniWidth * (blocks.length-1);
	var miniWidth = 0;
	var maxWidth = 100;


	for(let n = 0; n < blocks.length; ++n){
		let b = blocks[n];
		//b.style.width = miniWidth + "px";
		b.style.width = miniWidth + "%";
		b.onmouseenter = function(){};
		b.onmouseleave = function(){};
		b.onclick = function(){ clickOpen(blocks, n) };
		b.style.cursor = "pointer";
		b.querySelector(".content").hidden = true;
	}
	let b = blocks[index];
	//b.style.width = maxWidth + "px";
	b.style.width = maxWidth + "%";
	b.onclick = function(){ };
	b.style.cursor = "auto";
	b.querySelector(".content").hidden = false;

	document.querySelector("#header").style.height = "0";
	document.querySelector("#holder").style.height = "100%";
	document.querySelector("footer").style.height = "0";
}






function addEmail(){
	// Adds email in a safe way
	var aboutMe = document.querySelector("#header");
	if(aboutMe != null)
		aboutMe.innerHTML += "<p>axe6801" + "@" + "rit.edu</p>";
}



window.onload = function(){
	addEmail();
	document.querySelector("#loading").hidden = true;
	//document.querySelector("#holder").hidden = false;
	document.querySelector("#holder").style.display = "block";
	blocks = document.querySelectorAll(".block");
	initBlocks();
	setUpMouseOver();

	//document.onresize = function(e){ 
	//	console.log("resize");
	//	setUpMouseOver();
	//}
}