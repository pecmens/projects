function text(){
    let str = "CRM管理系统"
    let str_ = ''
    let i = 0
    let content = document.getElementById('line3')
    let timer = setInterval(()=>{
        if(str_.length<str.length){
            str_ += str[i++]
            content.innerHTML = str_ + "|";
            } else { 
            clearInterval(timer)
            content.innerHTML = str_;
        }
    },600)
}

text();

