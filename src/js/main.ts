const API: string = `https://cors-anywhere.herokuapp.com/http://api.deezer.com/`;

const search = document.querySelector<HTMLInputElement>(".search");

const searchClean = document.querySelector<HTMLElement>(".search-clean");

const burger = document.querySelector<HTMLElement>(".burger");

const formList = document.querySelector<HTMLElement>(".form-list");

const playlist = document.querySelector<HTMLElement>(".playlist");

const body = document.querySelector<HTMLElement>("body");


let tabIndexNumber: number;
let counter: number;
let arrPlaylist: any[];




// clean variables
function clean (): void{
    formList.innerHTML = "";
    tabIndexNumber = 0;
    counter = 0;
    arrPlaylist = [];

}

// render 
search.addEventListener("input", () => {
    if(search.value == ""){
        // searchClean.style.display = "none";
        clean();
    }else{
        searchState(search.value).then(data => {
            clean();

            searchClean.style.display = "block";
            data.data.forEach(function(element: any){
                // create div with class .row
                tabIndexNumber++;
                let row = document.createElement('div');
                row.classList.add("row");
                row.id = `${tabIndexNumber}`;
                // idArr.push();
                row.tabIndex = tabIndexNumber;
                
                // create Array with all song what we found
                const song: object = {
                    img: element.album.cover,
                    artistName: element.artist.name,
                    title: element.title,
                    track: element.preview 
                }
                arrPlaylist.push(song);

                row.innerHTML = `<div class = "image">
                                    <img src = ${element.album.cover}>
                                 </div>
                                 <div class = "discription">
                                    <h4>Artist: ${element.artist.name}</h4>
                                    <p>Title: ${element.title}</p>
                                 </div>`
    
                row.addEventListener("click", () => {
                    let element: number = Number(row.id) - 1;
                    renderPlaylist(element, arrPlaylist);
    
                })
    
                row.addEventListener("mouseover", () => {
                    row.focus();
                        let element: number = Number(row.id) - 1;
                        search.value = `${arrPlaylist[element].artistName} ${arrPlaylist[element].title}`;
                })
                formList.append(row);
            });
        })
    }
});


function renderPlaylist(element: number, arr: any): void{
    let row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = `<div class = "image">
                        <img src = ${arr[element].img}>
                    </div>
                    <div class = "discription">
                        <h4>Artist: ${arr[element].artistName}</h4>
                        <p>Title: ${arr[element].title}</p>
                    </div>
                    <div class = "controlPlaylist">
                        <button onclick = "this.parentNode.parentNode.remove()">Delete</button>
                        <svg onclick = "like(this)">
                            <use xlink:href="./img/symbol/svg/sprite.symbol.svg#heart-alt"/>
                        </svg>
                    </div>
                    <audio controls src = "${arr[element].track}"></audio>`;
    playlist.appendChild(row);

}

// search element from input
const searchState = async (element: string) => {
    const response = await fetch(API + "search?q=" + element);
    const data = await response.json();
    return data;
}

// search element from input
const apiForPlaylist = async (element: string) => {

    const response = await fetch(API + "track/" + element);
    const data = await response.json();
    return data;
}



// add click for down and up btn
document.addEventListener('keydown', (e) => {
    if(e.keyCode == 40) {
        if(counter < tabIndexNumber){
            if(counter >= 0){
                counter++;
                addFocus();
                cursorNone();
            }
            else{
                return;
            } 
        }              
    }else if(e.keyCode == 38){
        if(counter > 1){
            counter--;
            addFocus();
            cursorNone();
        }
    }else if (e.keyCode == 13){
        if(search.value != "" && counter > 0){
            renderPlaylist(counter - 1, arrPlaylist);
        }
    }
});

// focus on element from search
function addFocus(){
    let focusElement: HTMLElement = document.getElementById(`${counter}`);
    focusElement.focus();
    search.value = `${arrPlaylist[counter - 1].artistName} ${arrPlaylist[counter - 1].title}`;
}

// did that cursors can`t click
function cursorNone(): void{
    body.style.cursor = "none";
    body.style.pointerEvents = "none";
}

// did that cursors can click
function cursorVisibility(): void {
    body.style.cursor = "auto";
    body.style.pointerEvents = "auto";
}

document.addEventListener('mousemove', () => {
    cursorVisibility();
})

function like(element: any): void{
    element.classList.toggle("like");
}

// clear input value
searchClean.addEventListener("click", () =>{
    if(search.value != ""){
        clean();
        search.value = "";
        searchClean.style.display = "none";
    }
});


burger.addEventListener("click", () => {
    playlist.classList.toggle("active");
})


