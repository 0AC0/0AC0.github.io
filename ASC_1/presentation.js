var array_data = new Array();
var screen = 0;
var img = [
	"",
	"",
	"",
	"",
	""
];
var ctx = NaN;

function main(data) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", data, false);
	xmlhttp.send();

	if (xmlhttp.status == 200) {
		parse(xmlhttp.responseText);
	}

	img[0] = "res/macbook.png";
	img[1] = "res/thinkpad.png";
	img[2] = "res/samsung.png";
	img[3] = "res/samsung powersave.png";
	img[4] = "res/pi.png";

	const canvas = document.getElementById("canvas");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
		canvas.addEventListener('click', () => {
			nextScreen();
		}, false);
		nextScreen();
	}
}

function nextScreen() {
		screen += 1;
		if (screen >= array_data.length) { window.location.href = "finish.html"; }
		else graphScreen(screen);
}

function graphScreen(index) {
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	document.getElementById("title").textContent = array_data[index][0];
	drawGraph(10, 10, canvas.height - 100, canvas.width - 10, array_data[index]);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGraph(y, x, max_y, max_x, values) {
	const nr = values.length - 1;
	const padding = (max_y - y) / (3 * nr);
	const max = Math.max(...(values.slice(1, values.length)));
	const fg = getComputedStyle(document.documentElement).getPropertyValue("--fg");
	const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg");
	const sec = getComputedStyle(document.documentElement).getPropertyValue("--sec");
	const ter = getComputedStyle(document.documentElement).getPropertyValue("--ter");

	var height = ((max_y - y) / nr) - padding;
	var type = -1;

	ctx.strokeStyle = "";
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, max_x - x, max_y - y);

	const ZERO = document.timeline.currentTime;
	const FRAMES = 20;


	function anim(frame) {
		var val = (frame - ZERO) / FRAMES;

		ctx.fillStyle = sec;
		ctx.font = "500 " + 20 + "px B612";
		ctx.textBaseline = "middle";

		const DIVISIONS = max_x / max_y * 10;

		for (var i = 0; i < DIVISIONS; i++) {
			ctx.fillRect(
				x + (max_x * (i / DIVISIONS)),
				y,
				3,
				max_y - y
			);
			ctx.fillText(
				Math.floor(max * (i / DIVISIONS)),
				10 + x + (max_x * (i / DIVISIONS)),
				20
			);
			ctx.fillText(
				Math.floor(max * (i / DIVISIONS)),
				10 + x + (max_x * (i / DIVISIONS)),
				max_y - 20 
			);
		}

		ctx.font = "900 " + height / 4 + "px B612";
		ctx.textBaseline = "middle";

		if (nr > 0) {
			for (var i = 0; i < nr; i++) {
				ctx.fillStyle = fg;
				ctx.fillRect(
					x,
					y + i * height + padding * (i + 1),
					Math.max(height + ctx.measureText(values[i + 1]).width, (values[i + 1] / max * max_x) - x) * (val / FRAMES),
					height
				);
				ctx.fillStyle = bg;
				ctx.fillText(
					values[i + 1],
					Math.max(height + x - 10, ((values[i + 1] / max * max_x) - (ctx.measureText(values[i + 1]).width + 10) - x) * (val / FRAMES)),
					y + i * height + padding * (i + 1) + height / 2,
				);
			}
		} else {
			alert("Couldn't draw graph: Invalid data.");
		}
		if (val <= FRAMES) {
			window.requestAnimationFrame(anim)
		} else {
			for (let i = 0; i < nr; i++) {
				var im = new Image();
				im.src = img[i];
				im.onload = (image) => {
					ctx.drawImage(
						image.target,
						x,
						y + i * height + padding * (i + 1),
						height,
						height
					);
				}
			}
		}
	}
	anim(0);
}

function animateDrawGraph() {
}

function parse(data) {
	var index = 0;
	function consume() {
		while (
			data[index] != ','
			&& data[index] != '\n'
			&& data[index] != '\r'
			&& index < data.length
		) {
			index++;
		}
	}
	function peek() {
		var ret = index;
		while (
			data[ret] != ','
			&& data[ret] != '\n'
			&& data[ret] != '\r'
			&& ret < data.length
		) {
			ret++;
		}
		return ret;
	}
	var i2 = 0;
	if (array_data[i2] == undefined) {
		array_data[i2] = new Array();
	}
	for (var i = 0; index < data.length; i++) {
		if (data.codePointAt(peek()) != 10) {
			array_data[i2][i] = data.slice(index, peek());
			consume();
			index++;
		} else {
			array_data[i2][i] = data.slice(index, peek());
			i = -1;
			i2++;
			if (array_data[i2] == undefined) {
				array_data[i2] = new Array();
			}
			consume();
			index += 1;
		}
	}
}