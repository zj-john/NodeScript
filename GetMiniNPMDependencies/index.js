const child_process = require("child_process");
const fs = require('fs');
const PATH = require('path');
// console.log(path.sep, typeof(path.sep));

const exec_cmd = function(cmd) {
    child_process.exec(cmd, function(error, stdout, stderr) {
        if (error) {
            export_to_file(stderr, './error.txt');
            console.error('error: ' + error);
        }
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
    })
}

const export_to_file = (data, filename) => {
    fs.writeFile(filename, data, {
        flag: 'w'
    }, function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('写入成功');
        }
    });
}

const isType = (obj,type) => {
    return Object.prototype.toString.call(obj) ==="[object "+type+"]";
}
const deepTraverse = (data, dict, key) => {
  if (isType(data, "Object")) {
      let {name, version, dependencies, _dependencies, description} = data;
      dict[key] = {
          name: name || "",
          version: version || "",
          description: description || "",
          _dependencies: _dependencies || {},
          dependencies: {}
      }
      for (let k in dependencies) {
        deepTraverse(dependencies[k], dict[name]["dependencies"] , k)
      }
  } else if (isType(json, "Array")) {
        // for (var i = 0; i < json.length; i++) {
        //     var jsonObj = json[i];
        //     deepTraverse(jsonObj);
        // }
    } else if (isType(json, "String") || isType(json, "Number") || isType(json, "Boolean") || isType(json, "Null")) {
    }
}


const entry = () => {
    // 获取目录 或 当前目录
    const arguments = process.argv.splice(2);
    const path = arguments[0] || "";
    // 进入目录
    let cmd = "";
    if (path) {
      cmd = cmd + "cd /D " + path + ' && ';
    }
    // 执行命令
    cmd = cmd + 'npm ll --depth=10 --json >' + __dirname + PATH.sep + 'temp.json';
    const date = new Date();
    const time = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].join("-")
    child_process.exec(cmd, function(error, stdout, stderr) {
        fs.readFile(__dirname + PATH.sep + 'temp.json', 'utf8', (err, data) => {
            if (err)
                throw err;
            let source = JSON.parse(data);
            let {name, description, dependencies, devDependencies, _dependencies} = source;
            // json处理
            let format = {
                name: name,
                description: description,
                _dependencies: _dependencies,
                devDependencies: devDependencies,
                dependencies: {}
            }
            for (let k in dependencies) {
              deepTraverse(dependencies[k], format["dependencies"], k)
            }
            // 输出内容
            export_to_file(JSON.stringify(format, null, 4), __dirname + PATH.sep + name + '_' + time + '.json');
        });
        fs.unlink(__dirname + PATH.sep + 'temp.json', function (err) {
          if (err) return console.log(err);
          // console.log('文件删除成功');
        })

        if (error) {
            export_to_file(stderr, __dirname + PATH.sep + 'error.txt');
            console.error('error: ' + error);
        }
        // console.log("cmd exec success");
    })
}

entry();
