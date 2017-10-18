var canvas = document.querySelector('canvas');
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var btnFirst = document.getElementById("first");
var btnWorst = document.getElementById("worst");
var btnBest = document.getElementById("best");

var jobList = [], memoryList = [];
var jobListSize, memoryListSize;

var waitingQueue = [], processingQueue = [], timer = 0;

function Job(id, time, size, status, used) {
    this.id = parseInt(id);
    this.time = parseInt(time);
    this.size = parseInt(size);
    this.status = status;
    this.used = used;
}

function Memory(id, size, status){
    this.block = parseInt(id);
    this.size = parseInt(size);
    this.status = status;
}

document.getElementById('file').onchange = function(){
    var file = this.files[0];
    var reader = new FileReader();
    var tempJobList = [], tempMemList = [];
    var temp, job, memory;

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
            jobList[i] = new Job(temp[0], temp[1], temp[2], "Inactive", false);
        }

        for(var i = 0; i < tempMemList.length; i++){
            temp = tempMemList[i].split(" ");
            memoryList[i] = new Memory(temp[0], temp[1], "Free");
        }

        jobListSize = jobList.length;
        memoryListSize = memoryList.length;
        
        //Bad Testing
        console.log(jobList);
        console.log(memoryList);
    };
    
    //First-fit Algorithm
    function Firstfit(){
        console.log("First-fit Algorithm");

        for(var i = 0; i < jobListSize; i++){
            job = jobList[i];

            for(var j = 0; j < memoryListSize; j++){                
                memory = memoryList[j];
            
                if(memory.size >= job.size && memory.status === "Free" && job.status === "Inactive" && job.used === false){
                    memory.status = "Occupied";
                    job.status = "Active";
                    job.used = true;
                    processingQueue.push(job);
                }
            }

            if(job.status === "Inactive"){
                waitingQueue.push(job);
            }
        }

        // setInterval(ProcessJobsInMemory, 1000);
        // if(waitingQueue.length < 0){
        //     clearTimeout(ProcessJobsInMemory);
        // }

        //Bad Testing
        console.log(processingQueue);
        console.log(waitingQueue);
    }

    //Worst-fit Algorithm
    function Worstfit(){
        console.log("Worst-fit Algorithm");
    }

    //Best-fit Algorithm
    function Bestfit(){
        console.log("Best-fit Algorithm");
    }

    //Helper Functions
    function Test()
    {
        console.log("---------------------------------------------");        
        console.log("LIST OF JOBS");
        console.log("Jobs size: "+ jobListSize);
        console.log("---------------------------------------------");
        console.log(jobList);
        console.log("---------------------------------------------\n");

        console.log("---------------------------------------------");        
        console.log("LIST OF MEMORY");
        console.log("MEMORY size: "+ memoryListSize);
        console.log("---------------------------------------------");
        console.log(memoryList);
        console.log("---------------------------------------------\n\n");

        console.log("Processing QUEUE:");
        console.log(processingQueue);

        console.log("\n\nWaiting QUEUE:");
        console.log(waitingQueue);
    }

    function ResetStatus()
    {
        for(var i = 0; i < jobListSize; i++){
            job = jobList[i];
            job.status = "Inactive";
            job.used = false;
        }

        for(var i = 0; i < memoryListSize; i++){
            memory = memoryList[i];
            memory.status = "Free";
        }
    }

    function ProcessJobsInMemory(){        

        while(waitingQueue.length > 0){

        }
        for(var i = 0; i < processingQueue.length; i++){

            if(processingQueue[i].time === timer){

                var doneJob = processingQueue.indexOf(processingQueue[i]);
                console.log(doneJob);
                if(doneJob > -1){
                    processingQueue.splice(doneJob, 1);
                }
            }
        }

        timer++;
        
        //Bad testing
        // console.log(timer);
        // console.log(processingQueue);
    }

    //Button Events
    btnFirst.onclick = function(){
        Firstfit();
    }

    btnWorst.onclick = function(){
        Worstfit();
    }

    btnBest.onclick = function(){
        Bestfit();
    }

    reader.readAsText(file);
};


//DESIGN ~

function TableDesign(){
    context.fillStyle = "white";
    context.fillRect(0,0,width, height);
    context.fillStyle = "black";
    context.font = "16px Calibri";    
    context.fillText("PROCESSING JOBS IN MEMORY LIST",width/10,height/26);
    context.fillText("WAITING JOB LIST",width/1.5,height/26);

    context.moveTo(width/2,0);
    context.lineTo(width/2,height);
    context.stroke();

    context.moveTo(0,height/19);
    context.lineTo(width,height/19);
    context.stroke();
}

TableDesign();
