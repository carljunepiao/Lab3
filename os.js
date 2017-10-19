var canvas = document.querySelector('canvas');
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var btnFirst = document.getElementById("first");
var btnWorst = document.getElementById("worst");
var btnBest = document.getElementById("best");
var btnEvaluate = document.getElementById("evaluate");

var jobList = [], memoryList = [];
var jobListSize, memoryListSize;

var waitingQueue = [], processingQueue = [];
var timer = 0;

function Job(id, time, size, status, used, memoryId, fragment) {
    this.id = parseInt(id);
    this.time = parseInt(time);
    this.size = parseInt(size);
    this.status = status;
    this.used = used;
    this.memoryId = memoryId;
    this.fragment = fragment;
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
            jobList[i] = new Job(temp[0], temp[1], temp[2], "Inactive", false, 0, 0);
        }

        for(var i = 0; i < tempMemList.length; i++){
            temp = tempMemList[i].split(" ");
            memoryList[i] = new Memory(temp[0], temp[1], "Free");
        }

        jobListSize = jobList.length;
        memoryListSize = memoryList.length;
    };
    
    //ALGORITHMS
        //First-fit Algorithm
        function Firstfit(){
            console.log("_________________________________________");
            console.log("First-fit Algorithm"); //Remove afterwards

            InitializeJobsMemoryList();
            var loopFirst = setInterval(ProcessJobsInMemory, 1000);

            //Bad Testing
                // console.log(processingQueue);
                // console.log(waitingQueue);
        }

        //Worst-fit Algorithm
        function Worstfit(){
            console.log("_________________________________________");
            console.log("Worst-fit Algorithm"); //Remove afterwards

            memoryList.sort(DecreasingOrder);
            InitializeJobsMemoryList();

            var loopWorst = setInterval(ProcessJobsInMemory, 1000);
            
            //Bad Testing
                console.log(processingQueue);
                console.log(waitingQueue);
        }

        //Best-fit Algorithm
        function Bestfit(){
            console.log("_________________________________________");
            console.log("Best-fit Algorithm");

            memoryList.sort(IncreasingOrder);
            InitializeJobsMemoryList();

            var loopBest = setInterval(ProcessJobsInMemory, 1000);

            //Bad Testing
                console.log(processingQueue);
                console.log(waitingQueue);
        }

    //Helper Functions
        function InitializeJobsMemoryList(){
            for(var i = 0; i < jobListSize; i++){
                job = jobList[i];
    
                for(var j = 0; j < memoryListSize; j++){
                    memory = memoryList[j];
                
                    if(memory.size >= job.size && memory.status === "Free" && job.status === "Inactive" && job.used === false){
                        memory.status = "Occupied";
                        job.status = "Active";
                        job.used = true;
                        job.memoryId = memory.block;
                        job.fragment = memory.size - job.size;

                        processingQueue.push(job);
                    }
                }
    
                if(job.status === "Inactive" && job.used === false){
                    waitingQueue.push(job);
                }
            }
        }

        function ProcessJobsInMemory(){
            var temp = [], temp2 = [];
    
            TableDesign();
    
            //Check if done
            for(var i = 0; i < processingQueue.length; i++){
                processingQueue[i].time--;
                if(processingQueue[i].time === 0){
                    processingQueue[i].status = "Inactive";
                    processingQueue[i].used = true;
                    
                    //Change status of Memory to "Free" when job is released
                    for(var j = 0; j < memoryListSize; j++){
                        if(memoryList[j].block === processingQueue[i].memoryId){
                            memoryList[j].status = "Free";
                        }
                    }
                    temp.push(processingQueue[i]);
                }
            }
    
            //Remove job if done
            for(var j = 0; j < temp.length; j++){
                index = processingQueue.indexOf(temp[j]);
                processingQueue.splice(index,1);
            }
    
            //Loop through the waiting queue
            for(var i = 0; i < waitingQueue.length; i++){
                job = waitingQueue[i];
                for(var j = 0; j < memoryListSize; j++){
                    memory = memoryList[j];
    
                    if(memory.size >= job.size && memory.status === "Free" && job.status === "Inactive" && job.used === false){
                        memory.status = "Occupied";
                        job.status = "Active";
                        job.used = true;
                        job.memoryId = memory.block;
                        job.fragment = memory.size - job.size;
                        
                        temp2.push(waitingQueue[i]);
                        processingQueue.push(job);
                    }
                }
            }
    
            //Remove job in waiting queue, transfer to processing queue
            for(var i = 0; i < temp2.length; i++){
                index = waitingQueue.indexOf(temp2[i]);
                waitingQueue.splice(index,1);
            }
    
            //Bad Testing
            if(processingQueue.length === 0){
                console.log("ProcessingQueue is empty");
            }
    
            timer++;
        }

        function Reset(){
            for(var i = 0; i < jobListSize; i++){
                job = jobList[i];
                job.status = "Inactive";
                job.used = false;
            }

            for(var i = 0; i < memoryListSize; i++){
                memory = memoryList[i];
                memory.status = "Free";
            }

            processingQueue = [];
            waitingQueue = [];
        }

        function IncreasingOrder(a, b){
            return a.size - b.size;
        }

        function DecreasingOrder(a, b){
            return b.size - a.size;
        }

        //~useful
        function StopLoop(){
            clearInterval(loop);
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

        btnEvaluate.onclick = function(){

            alert("Show");
        }

    reader.readAsText(file);
};


//DESIGN ~

function TableDesign(){
    context.fillStyle = "white";
    context.fillRect(0,0,width, height);
    context.fillStyle = "black";
    context.font = "16px Calibri";    
    context.fillText("PROCESSING JOBS IN MEMORY LIST",width/5,height/26);
    context.fillText("WAITING JOB LIST",width/1.3,height/26);
    
    context.fillText("MEMORY #", width/40,height/12);
    context.fillText("JOB #", width/6.2,height/12);
    context.fillText("TIME", width/3.4,height/12);
    context.fillText("SIZE", width/2.3,height/12);
    context.fillText("FRAGMENTS", width/1.8,height/12);

    context.fillText("JOB #", width/1.38,height/12);
    context.fillText("SIZE", width/1.12,height/12);
    
    
    //Horizontal Line #1: Main Line    
    context.moveTo(0,height/19);
    context.lineTo(width,height/19);
    context.stroke();
    
    //Horizontal Line #2: Main Line 2
    context.moveTo(0,height/10);
    context.lineTo(width,height/10);
    context.stroke();
    
    //Vertical line #1: Main Line    
    context.moveTo(width/1.5,0);
    context.lineTo(width/1.5,height);
    context.stroke();

    //Vertical line #2: Memory List
    context.moveTo(width/4,height/19);
    context.lineTo(width/4,height);
    context.stroke();
    
    //Vertical line #3: Memory List    
    context.moveTo(width/2.6,height/19);
    context.lineTo(width/2.6,height);
    context.stroke();
    
    //Vertical line #4: Memory List    
    context.moveTo(width/1.9,height/19);
    context.lineTo(width/1.9,height);
    context.stroke();

    //Vertical line #5: Memory List, first line     
    context.moveTo(width/8.5,height/19);
    context.lineTo(width/8.5,height);
    context.stroke();

    //Vertical line #6: Memory List, second line     
    context.moveTo(width/1.2,height/19);
    context.lineTo(width/1.2,height);
    context.stroke();


    context.fillText("Timer: " +timer,width/50,height/26);

    //Output Processing Jobs
    for(var i = 0; i < processingQueue.length; i++){
        pJob = processingQueue[i];

        context.fillText("Memory " + pJob.memoryId, width/40,height/7 + (i*20));
        context.fillText("Job " + pJob.id, width/6.2,height/7 + (i*20));
        context.fillText(pJob.time, width/3.38,height/7 + (i*20));
        context.fillText(pJob.size, width/2.3,height/7 + (i*20));
        context.fillText(pJob.fragment, width/1.8,height/7 + (i*20));
    }

    //Output Waiting Jobs
    for(var i = 0; i < waitingQueue.length; i++){
        wJob = waitingQueue[i];
        context.fillText("Job " + wJob.id, width/1.38, height/7 + (i*20));
        context.fillText(wJob.size, width/1.12,height/7 + (i*20));        
    }
}

TableDesign();