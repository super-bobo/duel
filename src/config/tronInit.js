import tronConfig from './tronConfig';
import FullComponent from "../FullComponent";

let isTronWebInit = false // 是否已经在判断tronWeb初始化状态
let tronReady = false; // tronweb 是否加载完成

function tronInit (callback) {
    return new Promise(async resolve => {
        let tries = 0; // 尝试连接tronweb次数
        const init = async function() {
            if (window.tronWeb && window.tronWeb.ready) {
                resolve(callback && await callback());
                let host = window.tronWeb.eventServer.host;
                if(host !== tronConfig.TRONGRID_API) {
                    // 如果钱包网络是否一致，不一致弹框提示
                    !tronReady && FullComponent.remove('full-load'); // 移除loading效果
                    !tronReady && FullComponent.init('net-modal', 'netModal');
                    tronReady = true;
                }
            } else {
                setTimeout(async () => {
                    tries++;
                    if(tries >= 20 || isTronWebInit) {
                        if(!isTronWebInit) {
                            isTronWebInit = true;
                            // 弹出没有安装钱包插件的提示框
                            FullComponent.init('login-modal', 'loginModal');
                        }
                        return resolve(callback && await callback());
                    }
                    init(callback); // 递归重新调用，循环
                }, 100);
            }
        }
        init()
    })
    
};

export default tronInit