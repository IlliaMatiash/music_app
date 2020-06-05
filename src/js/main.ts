const API: string = `https://cors-anywhere.herokuapp.com/http://api.deezer.com/`;

const search = document.querySelector<HTMLInputElement>(".search");

const formList = document.querySelector<HTMLElement>(".form-list");

const playlist = document.querySelector<HTMLElement>(".playlist");




let tabIndexNumber: number;

let counter: number;

let idArr: number[];


// const formList = document.querySelector<HTMLElement>(".form-list");

// render 
search.addEventListener("input", () => {
    searchState(search.value).then(data => {
        formList.innerHTML = "";
        tabIndexNumber = 0;
        counter = 0;
        idArr = [];
        data.data.forEach(function(element: any){
            // create div with class .row
            tabIndexNumber++;
            let row = document.createElement('div');
            row.classList.add("row");
            row.id = `${element.id}`;
            idArr.push(element.id);
            row.tabIndex = tabIndexNumber;
            row.innerHTML = `<div class = "image">
                                <img src = ${element.album.cover}>
                             </div>
                             <div class = "discription">
                                <h4>Artist: ${element.artist.name}</h4>
                                <p>Title: ${element.title}</p>
                             </div>`
            row.addEventListener("click", () => {
                apiForPlaylist(row.id).then(data => {
                    let row = document.createElement("div");
                    row.classList.add("row");
                    row.innerHTML = `<div class = "image">
                                        <img src = ${element.album.cover}>
                                    </div>
                                    <div class = "discription">
                                        <h4>Artist: ${element.artist.name}</h4>
                                        <p>Title: ${element.title}</p>
                                    </div>
                                    <div class = "controlPlaylist">
                                        <button onclick = "this.parentNode.parentNode.remove()">Delete</button>
                                    </div>`;
                    playlist.appendChild(row);
                })
                console.log(row.id)
            })
            row.addEventListener("mouseover", () => {
                row.focus()
            })
            formList.append(row);
        });
    })
})

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

// searchState("7 years");

// function getUsers(element: string)  {
//     return fetch(API + element).then(res => {
//           return res.json();
//     }).catch(err => {
//         console.log('Cant get users' ,err);
//     })
// }

// add click for down and up btn
document.addEventListener('keydown', (e) => {
    if(e.keyCode == 40) {
        if(counter < tabIndexNumber){
            if(counter >= 0){
                counter++;
                console.log(counter)
                addFocus();
            }
            else{
                return;
            } 
        }              
    }else if(e.keyCode == 38){
        if(counter > 1){
            counter--;
            console.log(counter)

            addFocus();
        }
    }
});

// focus on element from search
function addFocus(){
    let focusElement: HTMLElement = document.getElementById(`${idArr[counter-1]}`);
    focusElement.focus();
}
