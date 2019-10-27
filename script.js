const btn = document.querySelector('button')
const form = document.querySelector('.form')
const result = document.querySelector('.result')
const table = document.querySelector('.table')

let title_table = Array.from(table.rows[0].cells)
                .slice(1, 5)
                .map(item => item.innerText)



const renderRowTable = (arr) => {
    let tr = document.createElement('tr')
    tr.className = 'table_column'

    arr.forEach((element,i)=> {

        if (i == 5) {
            result.lastElementChild.innerText = + result.lastElementChild.innerText + Number(element)
            return
        } else {
            let td = document.createElement('td')
            td.innerText = element
            tr.appendChild(td)
        }

        tr.addEventListener('mouseenter', showInfo);

        tr.addEventListener('mouseleave', removeInfo);

        result.insertAdjacentElement('beforebegin', tr)
    })

    
}


let ajax_get = function(evidence ,url, callback) {
    let xmlhttp = new XMLHttpRequest();

    let json = JSON.stringify(evidence);
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { 
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', "application/json");

    xmlhttp.send(json);
};

btn.addEventListener('click', () =>{

    const url = 'http://' + location.host + '/form/server/send.php?';
    let evidence = {};
    const formData = new FormData(document.forms.form);
    const inputs = form.querySelectorAll('input');
    
    let check = Array.from(inputs).every(el=>el.value != "");

    if(check) {
        for (let pair of formData.entries()){
            evidence[pair[0]] = pair[1];
        };
    
        ajax_get(evidence ,url, function (data){
            renderRowTable(data);
        });

        inputs.forEach(el=>el.value = '');
    } else {
        alert('Заполните все поля')
    }
})


function removeRow (e) {
    let tr = e.target.closest('tr');

    if(tr&&tr.className != 'result'&& tr.className != 'table_title') {
        const url = 'http://' + location.host + '/form/server/remove.php?';
        const cells = tr.querySelectorAll('td')

        let evidence = Array.prototype.slice.call(cells).map(item => {
            return item.innerText
        })

        ajax_get(evidence, url,  function (data){
            result.lastElementChild.innerText = + result.lastElementChild.innerText - data
            tr.remove()
            removeInfo()
        });
    }
}

table.addEventListener('click', removeRow);


window.onload = function() {
    let url = 'http://' + location.host + '/form/server/load.php?'


    ajax_get(null ,url, function (data){

        if(typeof data == 'string'){
            console.log(data)
        } else {
            data.forEach(arr => {
                renderRowTable(arr)
            })
        }
        
    })
};


// Сортировка
 
let lastSortRow = 0

function sortRow (e) {
    let index = e.target.cellIndex;
    let rows = table.querySelectorAll('.table_column')
    

    if(lastSortRow == index) return
        let sortedRows = Array.from(rows)
                    .slice()
                    .sort((rowA, rowB) => {
                        if(index == 3 || index == 4) {
                           return +rowA.cells[index].innerHTML > +rowB.cells[index].innerHTML ? 1 : -1;
                        } else {
                           return rowA.cells[index].innerHTML > rowB.cells[index].innerHTML ? 1 : -1;
                        }
                    });

        rows.forEach(item => {
            item.remove();
        })

    result.before(...sortedRows)
    
    lastSortRow = index
}


table.querySelectorAll('tr th').forEach(item => {
    item.addEventListener('click', sortRow)
}) 

// Подсказка 


function renderInfo(tr) {
    let blockInfo = document.createElement('div');
    let blockTitles =  document.createElement('div');
    let blockDatas =  document.createElement('div');
    
    blockInfo.className = 'info';
    blockDatas.className = 'data';

    blockInfo.prepend(blockTitles);
    blockInfo.append(blockDatas);

    title_table.forEach(item => {
        let p = document.createElement('p');
        p.innerHTML = item + ':';
        blockTitles.append(p);
    });

    tr.forEach(item => {
        let p = document.createElement('p');
        p.innerHTML = item;
        blockDatas.append(p);
    });

    return blockInfo;
}


function showInfo (e) {

    removeInfo()

    let tr = Array.from(e.target.closest('.table_column').cells)
                .slice(1)
                .map( item => item.innerText);

    let info = renderInfo(tr)
    info.style.position = 'absolute'

    document.body.append(info)

    moveAt(e.pageX, e.pageY);


    function moveAt(pageX, pageY) {
        info.style.left = pageX  + 'px';
        info.style.top = pageY - info.offsetHeight + 'px';
    }

    function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
    }
    
    document.addEventListener('mousemove', onMouseMove);
}

function removeInfo() {
    if(document.querySelector('.info')){
        document.querySelector('.info').remove();
    }
}
