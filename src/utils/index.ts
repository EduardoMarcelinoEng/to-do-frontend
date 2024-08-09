import { jwtDecode } from "jwt-decode";

export default {
    timeLeft(token: string){
        let exp = (jwtDecode(token)).exp as number;
        let now = Math.ceil(Date.now() / 1000);
        let diff = exp - now;
    
        return diff;
    }
}