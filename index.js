//这是c:\Users\29550\Desktop\WEB\ws-project\ws_proexe\index.js的代码
const { ipcRenderer } = require('electron')


window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn')
  btn.onclick = () => {
    console.log('点击')
    ipcRenderer.send('createNew')
  }

  let loginBtn = document.getElementById('loginBtn')
  loginBtn.onclick = () => {
    console.log('登录')
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let data = {
      username: username,
      password: password
    }
    let xlr = new XMLHttpRequest()
    xlr.open('POST', 'http://49.234.58.117:55556/login', true)
    xlr.setRequestHeader('Content-Type', 'application/json')
    xlr.send(JSON.stringify(data))
    xlr.onreadystatechange = function () {
      if (xlr.readyState === 4 && xlr.status === 200) {
        let result = JSON.parse(xlr.responseText)
        console.log(result)
        if (result.code === 200) {
          ipcRenderer.send('login', result.data)
        } else {
          alert('用户名或密码错误')
        }
      }
    }
    
  }



  const ffi = require('ffi-napi');
  const ref = require('ref-napi');
  const findWindow = require('find-window');
  const user32 = ffi.Library('user32', {
    'FindWindowA': ['long', ['string', 'string']], // 查找窗口的 WinAPI 函数
    'GetWindowThreadProcessId': ['uint32', ['long', 'uint32 *']], // 获取窗口进程ID
    'OpenProcess': ['long', ['uint32', 'int', 'uint32']], // 打开进程句柄
    'ReadProcessMemory': ['int', ['long', 'long', 'pointer', 'int', 'int *']], // 读取进程内存
    'CloseHandle': ['int', ['long']] // 关闭句柄
  });

  // 查找《植物大战僵尸》窗口
  const windowHandle = user32.FindWindowA(null, "Plants vs. Zombies");

  if (windowHandle === 0) {
    console.log("找不到《植物大战僵尸》窗口");
    process.exit(1);
  }

  console.log("窗口句柄:", windowHandle);

  // 获取进程 ID
  const processId = ref.alloc('uint32');
  user32.GetWindowThreadProcessId(windowHandle, processId);
  console.log("进程 ID:", processId.deref());

  // 打开进程句柄 (0x0010 是读取权限)
  const PROCESS_VM_READ = 0x0010;
  const processHandle = user32.OpenProcess(PROCESS_VM_READ, 0, processId.deref());

  if (processHandle === 0) {
    console.log("无法打开进程");
    process.exit(1);
  }

  // 读取进程内存（需要知道确切的内存地址和大小）
  // 假设我们想读取某个固定的内存地址（地址取决于具体的游戏版本和进程结构）
  const address = 0x12345678; // 这个是示例地址，实际地址需要调试工具查找
  const buffer = Buffer.alloc(4); // 假设我们要读取4个字节
  const bytesRead = ref.alloc('int');

  const result = user32.ReadProcessMemory(processHandle, address, buffer, buffer.length, bytesRead);

  if (result === 0) {
    console.log("读取内存失败");
  } else {
    console.log("读取的内存数据:", buffer.toString('hex'));
  }

  // 关闭进程句柄
  user32.CloseHandle(processHandle);






})

