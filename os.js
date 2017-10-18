var canvas = document.querySelector('canvas');
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var btnFirst = document.getElementById("first");
var btnWorst = document.getElementById("worst");
var btnBest = document.getElementById("best");

var jobList = [], memoryList = [];
var jobListSize, memoryListSize;

var waitingQueue = [], processingQueue = [];
var timer = 0;

var misFit = []; //Store too big job sizes

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
        
        // //Bad Testing
        // console.log(jobList);
        // console.log(memoryList);
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

        //Bad Testing
            console.log(processingQueue);
            console.log(waitingQueue);

        //Process Jobs
            setInterval(ProcessJobsInMemory, 1000);
            // ProcessJobsInMemory();

        // //Check Waiting Queue
        //     CheckWaitingQueue();
    }

    function ProcessJobsInMemory(){
        TableDesign();

        //Output Processing Jobs
        for(var i = 0; i < processingQueue.length; i++){
            pJob = processingQueue[i];
            context.fillText("Job " + pJob.id, width/8, height/7 + (i*20));
            context.fillText(pJob.size, width/2.1, height/7 + (i*20));            
        }

        //Output Waiting Jobs
        for(var i = 0; i < waitingQueue.length; i++){
            wJob = waitingQueue[i];
            context.fillText("Job " + wJob.id, width/1.25, height/9 + (i*20));            
        }

        for(var i = 0; i < processingQueue.length; i++){
            if(processingQueue[i].time === timer){
                console.log("Job "+ i + ":"+ processingQueue[i].time + ", "+ "Timer: " + timer);
                // if(processingQueue[i])
                //     processingQueue.splice(i, 1);
            }
        }
        // console.log(processingQueue);
        if(processingQueue.length === 0){
            console.log("ProcessingQueue is empty");
        }

        timer++;
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
        function Reset()
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

            waitingQueue = [];
        }

        function CheckWaitingQueue(){
            //Check if job size is too big, then store in misfit
            var check = false;
            for(var i = 0; i < waitingQueue.length; i++){
                for(var j = 0; j < memoryListSize; j++){
                    memory = memoryList[j];

                    if(waitingQueue[i].size > memory.size){
                        check = true;
                    }
                }
                if(check === true){
                    misFit.push(waitingQueue[i]);
                }
            }

            if(misFit.length !== 0){
                console.log("Still have: " + misFit.length + " jobs not processed.");
            }
        }

    //Button Events
        btnFirst.onclick = function(){
            Reset();
            Firstfit();
        }

        btnWorst.onclick = function(){
            Reset();
            Worstfit();
        }

        btnBest.onclick = function(){
            Reset();
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
    context.fillText("WAITING JOB LIST",width/1.3,height/26);

    context.fillText("JOBS",width/8,height/12);
    context.fillText("SIZE",width/2.1,height/12);
    
    //Horizontal Line #1: Main Line    
    context.moveTo(0,height/19);
    context.lineTo(width,height/19);
    context.stroke();
    
    //Horizontal Line #2: Main Line 2
    context.moveTo(0,height/10);
    context.lineTo(width/1.5,height/10);
    context.stroke();

    //Vertical line # 2: Main Line    
    context.moveTo(width/1.5,0);
    context.lineTo(width/1.5,height);
    context.stroke();
    
    //Vertical line #1: Memory List
    context.moveTo(width/3,height/19);
    context.lineTo(width/3,height);
    context.stroke();

    context.fillText("Timer: " +timer,width/50,height/26);    
}

TableDesign();