const fs = require("fs");
const defaultData = fs.readFileSync('default.txt');
const defaultItems = defaultData.toString().split("\r\n");
const data = fs.readFileSync('source.txt');
const dataList = data.toString().split("\r\n");

const initResult = ()=> {
	let result = {};
	result["allUserNum"] = dataList.length;
	result["otherUserNum"] = 0;
	result["otherRecordNum"] = 0;
	result["defaultRecordNum"] = {};
	defaultItems.map( (item) => {
		result["defaultRecordNum"][item] = 0;
	});
	return result;
}

let result = initResult();
let otherResult = [];


dataList.map((data) => {
	let itemList = data.split(",");
	let i = 0;
	const len = itemList.length;
	for (;i<len;i++) {
		let item = itemList[i].trim();
		if( defaultItems.indexOf(item)> -1 ) {
			result["defaultRecordNum"][item]++;
		} else {
			result["otherRecordNum"]++;
			otherResult.push(item);
		}
	}
	fs.writeFile('./other.txt', otherResult.join('\r\n') ,function(err){
		if(err) console.log('写文件操作失败');
	});
	// other user number
	let j = 0;
	for (;j<len;j++) {
		let item = itemList[j].trim();
		if (defaultItems.indexOf(item) == -1) {
			result["otherUserNum"]++;
			break;
		}
	}
})

// console.log('userNum is %s ,otherNum is %s, otherNum is %s.', userNum, otherNum, otherResult.length);
console.log(result);
