const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
const DOMAIN_REGEX = /^(?=.{1,253}\.?$)(?:(?!-|[^.]+_)[A-Za-z0-9-_]{1,63}(?<!-)(?:\.|$)){2,}$/


console.log(DOMAIN_REGEX.test("www.facebook.com"))