const ATTRIBUTES = JSON.parse('{"tag":[{"id":1000000,"caption":"皮肤黝黑"},{"id":1000001,"caption":"贫穷"},{"id":1000002,"caption":"富裕"},{"id":1000003,"caption":"强壮"},{"id":1000004,"caption":"脑洞"},{"id":1000005,"caption":"好胜"},{"id":1000006,"caption":"音乐"},{"id":1000007,"caption":"多病"},{"id":1000008,"caption":"烟瘾"},{"id":1000009,"caption":"身体协调"},{"id":1000010,"caption":"记忆"},{"id":1000011,"caption":"高情商"},{"id":1000012,"caption":"逻辑"},{"id":1000013,"caption":"好奇"},{"id":1000014,"caption":"吹口哨高手"},{"id":1000015,"caption":"熊孩子"},{"id":1000016,"caption":"近视眼"},{"id":1000017,"caption":"内向"},{"id":1010001,"caption":"户✌"}],"background":[{"id":0,"caption":"尖子生"},{"id":101,"caption":"老钱"}],"perk":[{"id":0,"caption":"健康"},{"id":1,"caption":"财富"},{"id":2,"caption":"学习成绩"},{"id":3,"caption":"音乐能力"},{"id":4,"caption":"画图能力"}],"achievement":[{}]}');
const EVENTS = JSON.parse('{"born":[{"id":0,"heading":"出生","content":"伴随着啼哭声，一个黑漆漆的婴儿降生了。母亲：“孩子这么黑，就叫%name吧。”","choice":[{"caption":"下一事件","attr":[["皮肤黝黑",1]],"perkChange":[["健康",100],["财富",5]]}]},{"id":1,"heading":"出生：贫穷","content":"%name出生在一个低保户家庭，家里穷得叮当响。","choice":[{"caption":"下一事件","attr":[["贫穷",1]],"perkChange":[["健康",100],["财富",2]]}]},{"id":2,"heading":"出生：富裕","content":"%name出生在一个城市家庭，住在二环内的一个大House里。","choice":[{"caption":"下一事件","attr":[["富裕",1]],"perkChange":[["健康",100],["财富",8]]}]},{"id":3,"heading":"出生：户✌","content":"%name出生在了申国户市，成为了大名鼎鼎的户✌。","choice":[{"caption":"下一事件","attr":[["富裕",1],["户✌",1]],"perkChange":[["健康",100],["财富",10]]}]},{"id":101,"heading":"出生：老钱","content":"一颗燃烧着熊熊烈火的橡皮泥（？）从天上坠落。一个好奇的妇人路过，发现里面包裹着婴儿，她决定收养这个婴儿，取名为%name。","choice":[{"caption":"下一事件","background":["老钱"],"perkChange":[["健康",100],["财富",5]]}]}],"normal":{"kid":[{"id":0,"heading":"学走路","content":"%name%blank的时候，突然学会了走路。","choice":[{"caption":"闯祸了被人追着打","attr":[["强壮",1]]},{"caption":"吃脚趾","attr":[["脑洞",1]]},{"caption":"和狗抢东西吃","attr":[["好胜",1]]},{"caption":"模仿MJ","attr":[["音乐",1]],"perkChange":[["音乐能力",1]]},{"caption":"看手把手教学"},{"caption":"走路还用学？","attr":[["身体协调",1]],"eventHeading":"天才","eventContent":"%name一生下来就会走路，根本不用学。"}]},{"id":1,"heading":"天赋","content":"%name一出生就%blank。","choice":[{"caption":"会跟小动物说话","eventLink":21,"ageChange":0},{"caption":"身体折起来，能吃到自己下面","attr":[["身体协调",1]],"eventContent":"%name一出生就身体折起来，能自己吃到自己下面。自从掌握了新姿势，蛋白质不流失、不蒸发、零浪费！"},{"caption":"能过目不忘","attr":[["记忆",1]]},{"caption":"学会说粗口","attr":[["高情商",1]]},{"caption":"酗酒","attr":[["多病",1]]},{"caption":"吸烟","attr":[["烟瘾",1]]},{"caption":"会飙歌","attr":[["音乐",1]],"perkChange":[["音乐能力",1]]},{"caption":"会素描","perkChange":[["画图能力",1]]},{"caption":"目的性很强","attr":[["逻辑",1]]},{"caption":"喜欢问5W1H","attr":[["好奇",1]]},{"caption":"会吹口哨","attr":[["音乐",1],["吹口哨高手",1]],"perkChange":[["音乐能力",1]]},{"caption":"是个熊孩子","attr":[["熊孩子",1]]}]},{"id":2,"heading":"幼儿日常","content":"%name%blank。","choice":[{"caption":"喜欢看电视","attr":[["近视眼",1]]},{"caption":"对玩具非常着迷","eventLink":"玩具迷","ageChange":0},{"caption":"喜欢玩耍","eventLink":21,"ageChange":0},{"caption":"喜欢玩平板电脑","attr":[["近视眼",1]]},{"caption":"经常安静地呆着","attr":[["内向",1]]}]},{"id":1000,"heading":"玩具迷","content":"%name最喜欢的玩具是%blank。","choice":[{"caption":"十万片的拼图","attr":[["近视眼",1]]},{"caption":"四驱车","eventLink":"玩具迷"},{"caption":"吸氧羊","eventLink":21},{"caption":"彩虹小马","attr":[["近视眼",1]]},{"caption":"超人变身器","attr":[["内向",1]]},{"caption":"烟花炮竹","attr":[["死亡",1]],"eventContent":"%name很喜欢放烟花，喜欢看爆炸的破坏力。有一次他把烟花插进屁股缝里点燃，烟花直接在他的屁股里爆炸，%name就这样失去了年轻的生命。"},{"caption":"电子琴","attr":[["内向",1]]},{"caption":"NS的LABO","attr":[["内向",1]]}]}]}}');
const NAME = document.getElementById("name").innerHTML;
const BLANK = "____";
const INDENT = "&emsp;&emsp;"




var historyList = document.getElementById("historyList");
var eventHistory = [], choiceHistory = [], ageHistory = [];
var eventNumKid = 3;
var chosen = 0, linked = 0, linkedSet;




var attrList = document.getElementById("attrList");
var ageTag = document.getElementById("age");
var tagList = [], backgroundList = [], perksIDList = [], perksPointList = [];
var age = 0;




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

function updateBackgroundList(list, deltaList)
{
    for (let idx = 0; idx < deltaList.length; ++idx)
    {
        let flag = list.indexOf(deltaList[idx]);
        if (flag == -1) list.push(deltaList[idx]);
    }
}

function updatePerkList(IDList, pointList, deltaList)
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

function showEvent(eventSet, id)
{
    while (choiceList.hasChildNodes()) choiceList.removeChild(choiceList.childNodes[0]);
    //while(choiceContent.hasChildNodes()) choiceList.removeChild(choiceList.childNodes[0]);
    let event;
    for(let i = 0; i < eventSet.length; ++i)
    {
        if(eventSet[i].id == id)
        {
            event = eventSet[i];
            break;
        }
    }


    choiceHeading.innerHTML = INDENT + event.heading;
    choiceContent.innerHTML = INDENT + replaceEscapeChr(event.content);


    for(let i = 0; i < event.choice.length; ++i)
    {
        let choiceButton = document.createElement("button");
        choiceButton.onclick = function()
        { 

            let curChoice = event.choice[i];
            if("attr" in curChoice) updateTagList(tagList, curChoice.attr);
            if("background" in curChoice) updateBackgroundList(backgroundList, curChoice.background);
            if("perkChange" in curChoice) updatePerkList(perksIDList, perksPointList, curChoice.perkChange);


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
            chosen = 1;
            
            
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
    chosen = 0;
    ageTag.innerHTML = age.toString() + "岁";
    var isNormal = Math.random();
    if (isNormal > 0)
    {
        var id = Math.floor(Math.random() * 4);
        showEvent(EVENTS.born,id);
    }
    else
    {

    }
}

function eventGenerate()
{
    chosen = 0;
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
    if (chosen == 1) eventGenerate();
    requestAnimationFrame(mainLoop);
}

born();
requestAnimationFrame(mainLoop);