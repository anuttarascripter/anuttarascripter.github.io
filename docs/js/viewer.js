const clog = console.log;
clog("hello github");

const url = new URL(window.location);
const params = new URLSearchParams(url.search);
const title = params.get("title");

const divMain = document.getElementById("div-main");
const md = document.createElement("zero-md");
md.src = `/md/${title}.md`;
divMain.appendChild(md);
