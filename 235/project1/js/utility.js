function makeRectangle(width=50,height=50,color=0xFF0000){
	// http://pixijs.download/dev/docs/PIXI.Graphics.html
	let rect = new PIXI.Graphics();
	rect.beginFill(color);
	rect.lineStyle(2, 0x000000, 1);
	rect.drawRect(0, 0, width, height);
    rect.endFill();
	return rect;
}