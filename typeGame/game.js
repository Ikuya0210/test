//htmlから引っ張ってくるもの
const titleScene = document.getElementById('title');
const gameScene = document.getElementById('game');
const resultScene = document.getElementById('result');

const question_text = document.getElementById("question_text")
const form = document.getElementById("form")
const timer_text = document.getElementById("timer_text")
const seikai_text = document.getElementById("seikai_text")
//sound
const pirorin_sound = new Audio("sound/pirorin.mp3");
const pipon_sound = new Audio("sound/pipon.mp3");
const bboo_sound = new Audio("sound/bboo.mp3");
//その他変数
let state = false;//連打防止
let time = 0;//残り時間
let seikai_num = 0;//正解数
let q_num = 0;//問題番号を入れる変数
let CountDown=setInterval(null,1000)//タイマー
function CountDownFunc(){
    timer_text.textContent="残り"+ --time +"秒";
    if(time<=0){
        state=false;
        form.style.visibility="hidden";
        Finish();
    }
}

//問題文
const q = ["アイスクリーム","学生","先生","星","咳","ヨーロッパ","合格",
            "太陽","恋愛","石","国際","チーム","大学","高校",]
//制限時間(秒)
const time_length=30;
//正解の基準
const clearLine=[2,4,7,9]

//Scene切り替え
//0=>TItle, 1 => Game, 2 =>result
let sceneNum=0;//Enterキーでの入力分岐のため
function changeScene (num) {
    pirorin_sound.play();
    switch(num){
        case 0:
            sceneNum=0;
            state=false;
            setTimeout(()=>{
                state=true;
            },1500)
            titleScene.style.display="block";
            gameScene.style.display="none";
            resultScene.style.display="none";
            break;
        case 1:
            sceneNum=1;
            titleScene.style.display="none";
            gameScene.style.display="block";
            resultScene.style.display="none";
            start();
            break;
        case 2:
            sceneNum=2;
            titleScene.style.display="none";
            gameScene.style.display="none";
            resultScene.style.display="block";
            break;
        default:
            break;
    }
  };

changeScene(0);//実際に実行

//gameSceneの初期化
function start(){
    seikai_num=0;
    seikai_text.textContent="正解数"+seikai_num;
    form.style.visibility="visible";
    
    time=time_length;
    CountDown=setInterval(CountDownFunc,1000);
    init();
}

//問題の初期化
function init(){
    state=true;
    //前のものと被らないようにする
    const t= q_num;
    while(t===q_num){
        q_num = Math.floor(Math.random()*q.length);
    }
    question_text.textContent=q[q_num];
    form.value = "";
    form.focus();
}


//エンターキー
window.document.onkeydown = function(event){
    if (event.key === 'Enter'&&state) {
        switch(sceneNum){
            case 0:
                changeScene(1);
                break;
            case 1:
                //ローマ字入力の場合２回エンターを押すので
                if(form.value != "")
                    Decide();
                break;
            case 2:
                changeScene(0);
                break;
        }
    }
}
//決定ボタンクリック
document.getElementById("decide")
        .addEventListener("click",()=>{if(state)Decide();});
//決定した時の処理
function Decide(){
    state=false;
    //正解か判定
    if(form.value===q[q_num]){
        //正解の場合
        seikai_num++;
        seikai_text.textContent="正解数"+seikai_num
        pipon_sound.play();
        //入力欄のリセットのため、少しだけ待つ
        setTimeout(() => {
            init()
            }, 50);
    }else{
        //不正解の場合
        question_text.textContent="XXX"
        bboo_sound.play();
        //1000ミリ秒遅らせる
        setTimeout(() => {
            init()
            }, 1000);
    }
}




//終了処理
function Finish(){
    clearInterval(CountDown);
    timer_text.textContent="終わり";
    setTimeout(() => {
        changeScene(2);
        let text="";
        //正解数に応じて変わるコメント
        if(seikai_num < clearLine[0]){
            text="うんこ";
        }else if(clearLine[0]<=seikai_num&&seikai_num<clearLine[1]){
            text="まあまあ";
        }else if(clearLine[1]<=seikai_num&&seikai_num<clearLine[2]){
            text="普通";
        }else if(clearLine[2]<=seikai_num&&seikai_num<clearLine[3]){
            text="すごいかも";
        }else{
            text="すごい";
        }
        document.getElementById("result_text").textContent=((seikai_num>0)?seikai_num+"問正解！":"正解していません")+" "+text;
        //連打防止
        setTimeout(()=>{
            state=true;
        },2000)
    }, 2000);
}

//リトライ処理
document.getElementById("retry")
        .addEventListener("click",()=>{
    clearInterval(CountDown);
    changeScene(1);
})