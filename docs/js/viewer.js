const clog = console.log;
clog("hello github");

const url = new URL(window.location);
const params = new URLSearchParams(url.search);
const item = params.get("item");

const divMain = document.getElementById("div-main");
const md = document.createElement("zero-md");
md.src = `/md/${item}.md`;
divMain.appendChild(md);
