current_string = "";

document.addEventListener("keydown", (event) => {
	console.log(event);
	if (event.key.match(/[A-Za-z ,.:;!?'-]|/) && event.key.length == 1) {
		current_string += event.key;
		show_translation(current_string, 0);
	}
	if (event.key == "Backspace" && current_string.length > 0) {
		current_string = current_string.substring(0, current_string.length-1);
		show_translation(current_string, 0);
	}
});