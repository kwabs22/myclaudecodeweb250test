/** String to Integer (atoi) - Game: "Number Parser" */
var Atoi = pc.createScript('atoi');
Atoi.prototype.initialize = function() { this.score = 0; };
Atoi.prototype.myAtoi = function(s) {
    let i = 0;
    const n = s.length;
    
    while (i < n && s[i] === ' ') i++;
    
    let sign = 1;
    if (i < n && (s[i] === '+' || s[i] === '-')) {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }
    
    let result = 0;
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s[i].charCodeAt(0) - '0'.charCodeAt(0);
        
        if (result > Math.floor(INT_MAX / 10) || 
            (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }
        
        result = result * 10 + digit;
        i++;
        this.score += 5;
    }
    
    return result * sign;
};
