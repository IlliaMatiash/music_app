const API: string = `https://cors-anywhere.herokuapp.com/http://api.deezer.com/`;

const search = document.querySelector<HTMLInputElement>(".search");

const formList = document.querySelector<HTMLElement>(".form-list");

const playlist = document.querySelector<HTMLElement>(".playlist");


let tabIndexNumber: number;
let counter: number;
let arrPlaylist: number[];


// const formList = document.querySelector<HTMLElement>(".form-list");

function clean (): void{
    formList.innerHTML = "";
    tabIndexNumber = 0;
    counter = 0;
    arrPlaylist = [];
}

// render 
search.addEventListener("input", () => {
    if(search.value == ""){
        formList.innerHTML = "";
    }else{
        searchState(search.value).then(data => {
            clean();
            data.data.forEach(function(element: any){
                // create div with class .row
                tabIndexNumber++;
                let row = document.createElement('div');
                row.classList.add("row");
                // row.id = `${element.id}`;
                row.id = `${tabIndexNumber}`;
                // idArr.push();
                row.tabIndex = tabIndexNumber;
                
                // create Array with all song what we found
                const song: any = {
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
                    let element: number = Number(row.id);
                    renderPlaylist(element, arrPlaylist);
    
                })
    
                row.addEventListener("mouseover", () => {
                    row.focus()
                })
                row.addEventListener("focus", () => {
                    apiForPlaylist(row.id).then(data => {
                        search.value = `${element.artist.name} ${element.title}`;
                    })
                })
                formList.append(row);
            });
            console.log(data.data)
            // renderSearchElement();
            
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
                    </div>`;
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
            }
            else{
                return;
            } 
        }              
    }else if(e.keyCode == 38){
        if(counter > 1){
            counter--;
            addFocus();
        }
    }else if (e.keyCode == 13){
        renderPlaylist(counter - 1, arrPlaylist);
    }
});

// focus on element from search
function addFocus(){
    let focusElement: HTMLElement = document.getElementById(`${counter}`);
    focusElement.focus();
}

