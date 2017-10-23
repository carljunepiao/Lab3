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

var waitingQueue = [], processingQueue = [], tempWaitingQueue = [];
var timer = 0, t = 0;

//Evaluation
var totalMemoryLocations = 50000;

    //Throughput
    var throughput = 0, jobt = 0;
    var tCycleFirst, tCycleWorst, tCycleBest;

    //Storage Utilization
    var mostUsedSlot, leastUsedSlot, totalMemorySpaceUsed, totalMemorySpacePartitionsUsed;

    //Waiting Queue Length
    var totalJobsQueue;

    //Waiting time in Queue
    var totalWaitTimeQueue = 0, averageWaitingTime, maximumWaitingTime, release = 0;

    //Internal Fragmentation
    var percentageFrag = 0;


function Job(id, time, size, status, done, memoryId, fragment) {
    this.id = parseInt(id);
    this.time = parseInt(time);
    this.size = parseInt(size);
    this.status = status;
    this.done = done;
    this.memoryId = memoryId;
    this.fragment = fragment;
}

function Memory(id, size, status, job, cnt){
    this.block = parseInt(id);
    this.size = parseInt(size);
    this.status = status;
    this.job = job;
    this.count = cnt;
}

document.getElementById('file').onchange = function(){
    var file = this.files[0];
    var reader = new FileReader();
    var tempJobList = [], tempMemList = [];
    var renewJobList = [], renewMemList = [];
    var temp, job, memory, loop, countWaitingJob = 0;

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
            memoryList[i] = new Memory(temp[0], temp[1], "Free", new Job, 0);
        }
        
        jobListSize = jobList.length;
        memoryListSize = memoryList.length;
    };
    
    //ALGORITHMS
        //First-fit Algorithm
        function Firstfit(){
            console.log("First-Fit Algorithm");
            InitializeJobsMemoryList();
            loop = setInterval(ProcessJobsInMemory, 1000);
        }

        //Worst-fit Algorithm
        function Worstfit(){
            console.log("Worst-Fit Algorithm");
            memoryList.sort(DecreasingOrder);
            InitializeJobsMemoryList();
            loop = setInterval(ProcessJobsInMemory, 1000);
        }

        //Best-fit Algorithm
        function Bestfit(){
            console.log("Best-Fit Algorithm");            
            memoryList.sort(IncreasingOrder);
            InitializeJobsMemoryList();
            loop = setInterval(ProcessJobsInMemory, 1000);
        }

    //Helper Functions
        function InitializeJobsMemoryList(){
            for(var i = 0; i < jobListSize; i++){
                job = jobList[i];
    
                for(var j = 0; j < memoryListSize; j++){
                    memory = memoryList[j];
                
                    if((memory.size >= job.size) && (memory.status === "Free") && (job.status === "Inactive") && (job.done === false)){
                        memory.status = "Occupied";
                        memory.job = job;
                        memory.count++;

                        job.status = "Active";
                        job.done = true;
                        job.memoryId = memory.block;
                        job.fragment = memory.size - job.size;
                        percentageFrag += job.fragment;

                        processingQueue.push(job);
                    }
                }
                
                if(job.status === "Inactive" && job.done === false){
                    waitingQueue.push(job);
                }
            }
        }

        function ProcessJobsInMemory(){
            var temp = [], temp2 = [], orgTime;

            TableDesign();
            timer++;
            
            //Check if done
            for(var i = 0; i < processingQueue.length; i++){
                orgTime = processingQueue[i].time;
                processingQueue[i].time--;
                if(processingQueue[i].time === 0){

                    //Bad Test
                    console.log("Job "+ processingQueue[i].id + " is done.");

                    processingQueue[i].status = "Inactive";
                    processingQueue[i].done = true;
                    totalWaitTimeQueue += orgTime;
                    
                    //Change status of Memory to "Free" when job is released
                    for(var j = 0; j < memoryListSize; j++){
                        if(memoryList[j].block === processingQueue[i].memoryId){
                            memoryList[j].status = "Free";
                            memoryList[j].job = null;
                        }
                    }

                    temp.push(processingQueue[i]);
                }

                if(processingQueue[i].done){
                    jobt++;
                }
            }
            
            jobt = jobt / timer;
            throughput += jobt;
    
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
    
                    if(memory.size >= job.size && memory.status === "Free" && job.status === "Inactive" && job.done === false){
                        memory.status = "Occupied";
                        memory.job = job;
                        memory.count++;

                        job.status = "Active";
                        job.done = true;
                        job.memoryId = memory.block;
                        job.fragment = memory.size - job.size;

                        percentageFrag += job.fragment;

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
    
            TableDesign();
            
            //Bad Testing
            if(processingQueue.length === 0){
                TableDesign();
                StopLoop();
                console.log("Processing Queue is now empty.");
                console.log("_____________________________________");
                console.log("Time Done: " + timer + "\nTotal Done Jobs: 24" + "\nAverage Throughput: " + TotalThroughput()
                    + "\nStorage Utilization: " + "block# " +UtilCountMost() +"(most used), " + "block# " + UtilCountLeast() + "(least used)"
                    // + "\nAverage Waiting Time: " + AveWaitingTime() 
                    +"\nAverage Fragmentation: " + AveFragmentation()
                );
            }            
        }

        function UtilCountMost(){
            tmp = memoryList.sort(countOrderDec);
            return tmp[0].block;
        }

        function UtilCountLeast(){
            tmp = memoryList.sort(countOrderInc);
            return tmp[0].block;
        }

        function AveFragmentation(){
            return percentageFrag/24;
        }

        function TotalThroughput(){
            return throughput/24;
        }

        function AveWaitingTime(){
            return totalWaitTimeQueue/24;
        }

        function countOrderDec(a, b){
            return b.count - a.count;
        }

        function countOrderInc(a, b){
            return a.count - b.count;
        }

        function IncreasingOrder(a, b){
            return a.size - b.size;
        }

        function DecreasingOrder(a, b){
            return b.size - a.size;
        }

        function StopLoop(){
            clearInterval(loop);
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