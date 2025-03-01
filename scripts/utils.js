export function day(){
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = days[new Date().getDay()];
    return day
}

export function month(){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
    const month = months[new Date().getMonth()];
    return month
}

export function extractNumberFromString(text){
    const numberArr = text.match(/(\d+)/);
    const number = numberArr[0];
    return number;
}