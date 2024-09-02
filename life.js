function PriorityQueue() 
{
    var items = [];
    function QueueElement(element, priority) 
    {
        this.element = element;
        this.priority = priority;
    }
    this.push = function(element, priority) 
    {
        var queueElement = new QueueElement(element, priority);
        var inserted = false;
        for(var i = 0; i < items.length; ++i)
        {
            if (queueElement.priority > items[i].priority) 
            {
                items.splice(i, 0, queueElement);
                inserted = true;
                break;
            }
        }
        if (!inserted) items.push(queueElement);
    }
    this.pop = function()
    {
        if (this.empty()) return;
        items.pop();
    }
    this.top = function()
    {
        if (this.empty()) return;
        return items[0].element;
    }
    this.randomPop = function()
    {
        if (this.empty()) return;
        var idx = Math.floor(Math.random() * items.length);
        var res = items[idx];
        items.splice(idx, 1);
        return res;
    }
    this.size = function() { return items.length; }
    this.empty = function() { return items.length == 0; }    
    this.print = function() { return items; }        
}


async function getJSON(path)
{
    var res;
    await fetch(path)
    .then(response => response.json())
    .then((json) => { res = json; });
    //console.log(res);
    return res;
}
const EVENTS = await getJSON("events.json");
const ATTRIBUTES = await getJSON("attributes.json");
const NAME = document.getElementById("name").innerHTML;
const BLANK = "____";
const INDENT = "&emsp;&emsp;"




var allNormalEvents = new PriorityQueue();
var currentNormalEvents = new PriorityQueue();
var currentSerialEvents = [];




var historyList = document.getElementById("historyList");
var eventHistory = [], choiceHistory = [], ageHistory = [];
var state, linked, linkedSet;




var attrList = document.getElementById("attrList");
var ageTag = document.getElementById("age");
var tagList = [], backgroundList = [], perksIDList = [], perksPointList = [];
var age;




var choiceHeading = document.getElementById("choiceHeading")
var choiceContent = document.getElementById("choiceContent")
var choiceList = document.getElementById("choiceList");




function replaceEscapeChr(string, blank=BLANK)  //转义字符替换
{
    string = string.replaceAll("%name", NAME);
    string = string.replaceAll("%blank", blank);
    return string;
}

function setStyleByClass(node, className)
{
    let style = document.createAttribute("class");
    style.value = className;
    node.setAttributeNode(style);
}

function showAttr()
{
    ageTag.innerHTML = age.toString() + "岁";
    while (attrList.hasChildNodes()) attrList.removeChild(attrList.childNodes[0]);
    attrList.appendChild(document.createElement("hr"));

    for (let i = 0; i < tagList.length; ++i) //当前标签栏
    {    
        for (let j = 0; j < ATTRIBUTES.tag.length; ++j)   //查询特质表
        {
            if (ATTRIBUTES.tag[j].caption == tagList[i]) 
            {
                let tag = document.createElement("div");
                let caption = document.createTextNode(ATTRIBUTES.tag[j].caption);
                tag.appendChild(caption);
                setStyleByClass(tag, "tag");
                attrList.appendChild(tag);
                attrList.appendChild(document.createElement("br"));
            }
        }
    }
    for (let i = 0; i < perksIDList.length; ++i) //当前技能栏
    {
        for (let j = 0; j < ATTRIBUTES.perk.length; ++j)
        {
            if (ATTRIBUTES.perk[j].caption == perksIDList[i]) 
            {
                let tag = document.createElement("div");
                let caption = document.createTextNode(ATTRIBUTES.perk[j].caption + ":" + perksPointList[i].toString());
                tag.appendChild(caption);
                setStyleByClass(tag, "tag");
                attrList.appendChild(tag);
                attrList.appendChild(document.createElement("br"));
            }
        }
    }
}

function showHist()
{
    while (historyList.childElementCount > 1) historyList.removeChild(historyList.childNodes[1]);

    for (let i = 0; i < choiceHistory.length; ++i)
    {
        let ageStamp = document.createElement("div");
        let eventHeading = document.createElement("div");
        let eventContent = document.createElement("div");
        ageStamp.innerHTML = ageHistory[i].toString()+"岁";
        if ("eventHeading" in choiceHistory[i]) eventHeading.innerHTML = replaceEscapeChr(choiceHistory[i].eventHeading);
        else eventHeading.innerHTML = replaceEscapeChr(eventHistory[i].heading)
        if ("eventContent" in choiceHistory[i]) eventContent.innerHTML = INDENT + replaceEscapeChr(choiceHistory[i].eventContent);
        else eventContent.innerHTML = INDENT + replaceEscapeChr(eventHistory[i].content, choiceHistory[i].caption);
        setStyleByClass(ageStamp, "ageStamp");
        setStyleByClass(eventHeading, "eventHeading");
        setStyleByClass(eventContent, "eventContent");


        let historyTag = document.createElement("div");
        historyTag.appendChild(ageStamp);
        historyTag.appendChild(eventHeading);
        historyTag.appendChild(eventContent);
        setStyleByClass(historyTag, "history");


        historyList.appendChild(historyTag);
        historyList.appendChild(document.createElement("br"));
    }
}

function updateTagList(list, deltaList)
{
    for (let idx = 0; idx < deltaList.length; ++idx)
    {
        let flag = list.indexOf(deltaList[idx][0]);
        if (flag == -1 && deltaList[idx][1] == 1) list.push(deltaList[idx][0]);
        else if (flag != -1 && deltaList[idx][1] == 0) list.splice(flag, 1);
    }
}

function updatePerkListByChange(IDList, pointList, deltaList)
{
    for (let idx = 0; idx < deltaList.length; ++idx)
    {
        let flag = IDList.indexOf(deltaList[idx][0]); //If not found, return -1.
        if (flag != -1) pointList[flag] += deltaList[idx][1];
        else
        {
            IDList.push(deltaList[idx][0]);
            pointList.push(deltaList[idx][1]);
        }
    }
}

function updatePerkListByRemove(IDList, pointList, deltaList)
{
    for (let idx = 0; idx < deltaList.length; ++idx)
    {
        let flag = IDList.indexOf(deltaList[idx]); //If not found, return -1.
        if (flag != -1)
        {
            IDList.splice(flag, 1);
            pointList.splice(flag, 1);
        }
    }
}

function showEvent(event)
{
    while (choiceList.hasChildNodes()) choiceList.removeChild(choiceList.childNodes[0]);
    choiceHeading.innerHTML = INDENT + event.heading;
    choiceContent.innerHTML = INDENT + replaceEscapeChr(event.content);


    for(let i = 0; i < event.choice.length; ++i)
    {
        let choiceButton = document.createElement("button");
        choiceButton.onclick = function()
        { 

            let curChoice = event.choice[i];
            if("attr" in curChoice) updateTagList(tagList, curChoice.attr);
            if("background" in curChoice) updateTagList(backgroundList, curChoice.background);
            if("perkChange" in curChoice) updatePerkListByChange(perksIDList, perksPointList, curChoice.perkChange);
            if("perkRemove" in curChoice) updatePerkListByRemove(perksIDList, perksPointList, curChoice.perkRemove); 


            eventHistory.push(event);
            choiceHistory.push(curChoice);
            ageHistory.push(age)
            if ("ageChange" in curChoice) age += curChoice.ageChange;
            else age += 1;
            if ("eventLink" in curChoice)
            {
                linked = curChoice.eventLink;
                linkedSet = eventSet;
            }
            state = 1;
            
            
            showAttr();
            showHist();
        };
        choiceButton.id = "choiceButton" + i.toString();
        choiceButton.appendChild(document.createTextNode(event.choice[i].caption));
        setStyleByClass(choiceButton, "choiceButton");
        choiceList.appendChild(choiceButton);
    }
}

function born()
{
    state = 0;
    ageTag.innerHTML = age.toString() + "岁";
    //var isNormal = Math.random();
    var idx = Math.floor(Math.random() * EVENTS.born.length - 1);
    showEvent(EVENTS.born[idx]);
}

function eventUpdate()
{
    
}

function eventGenerate()
{
    state = 0;
    if (linked != 0)
    {
        for (let i = 0; i < linkedSet.length; ++i)
        {
            if (linked == linkedSet[i].heading)
            {
                showEvent(linkedSet, linkedSet[i].id);
                break;
            }
        }
        linked = 0;
        linkedSet = 0;
        return;
    }
    if (age < 4)
    {
        var id = Math.floor(Math.random() * eventNumKid);
        var flag = eventHistory.indexOf(EVENTS.normal.kid[id]);
        while (flag + 1)
        {
            id = Math.floor(Math.random() * eventNumKid);
            flag = eventHistory.indexOf(EVENTS.normal.kid[id]);
        }
        //eventHistory.push(EVENTS.normal.kid[id]);
        showEvent(EVENTS.normal.kid,id);
        console.log(eventHistory);
        //console.log(choiceHistory);
        //console.log(historyList.childNodes);
    }
}

function mainLoop()
{
    if (state == 1) eventUpdate(), eventGenerate();
    else if (state == 2) ;
    requestAnimationFrame(mainLoop);
}


function init()
{
    for (let i = 0; i < EVENTS.normal.length; ++i) allNormalEvents.push(EVENTS.normal[i]);
    age = 0;
    state = 0;
}


init();
born();
requestAnimationFrame(mainLoop);
/*

出生
从出生事件中抽取事件

全部基本事件按年龄下限排列
按年龄下限 且符合条件 进入优先队列
队列内按年龄上限排列，超过该年龄直接出队，未超过年龄但不符合条件的放回全部基本事件
{
    条件：
        tag     ["caption", 1/0]
                            有/无
        perk    ["caption", -1/0/1, value]
                            小于/等于/大于
}


随机从优先队列中抽取事件
抽到的事件出队

触发系列事件
改变状态，创建事件池，记录跳出所需经历的事件数/年数

死亡
检测特质栏是否有死亡标签

*/