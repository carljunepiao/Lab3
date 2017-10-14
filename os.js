var canvas = document.querySelector('canvas');
var context = canvas.getContext("2d");

var jobList = [];
var memoryList = [];

var waitingQueue = [];

function Job(id, time, size, status){
    this.id = id;
    this.time = time;
    this.size = size;
    this.status = status;
}

function Memory(id, size){
    this.block = id;
    this.size = size;
}

document.getElementById('file').onchange = function(){
    var file = this.files[0];
    var reader = new FileReader();
    var tempJobList = [];
    var tempMemList = [];
    var temp;

    reader.onload = function(progressEvent){
        
        //File Reading
        file = this.result.split("\n");

        for(var i = 0; i < 25; i++){
            tempJobList[i] = file[i];
        }

        for(var i = 26, j = 0; i < 36; i++, j++){
            tempMemList[j] = file[i];
        }

        for(var i = 0; i < tempJobList.length; i++){
            temp = tempJobList[i].split(" ");
            jobList[i] = new Job(temp[0], temp[1], temp[2], 0);
        }

        for(var i = 0; i < tempMemList.length; i++){
            temp = tempMemList[i].split(" ");
            memoryList[i] = new Memory(temp[0], temp[1]);
        }

        // console.log(jobList);
        // console.log(memoryList);



    };
    reader.readAsText(file);     
};