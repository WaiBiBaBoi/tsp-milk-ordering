import router from "@/router/index";
import { getSystemMenu } from "@/api/api";
import { setMenu,getMenu } from "@/utils/storage";

const loadComponent = async (path) => {
    try {
        let component = await import(`@/views${path}`);
        console.log(component);
        return component.default;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const addRoute = async () => {
    let memu = getMenu()
    console.log(memu);
    if(memu === null){
        const result = await getSystemMenu();
        if(result){
            memu = result.data
            setMenu(memu)
        }
    }
    if(!memu) return
    for (const element of memu) {
        // 正确使用await以同步地处理每个组件
        await loadComponent(element.menu_address).then((component) => {
            // 你的添加路由逻辑...
            if (component) {
                console.log(component);
                // 如果component存在，则添加至路由
                router.addRoute("system", {
                    path: element.route_address,
                    name: element.menu_name,
                    component: component,
                });
            } else {
                // 如果component为null，代表加载失败，进行错误处理
                console.error(
                    `Failed to load component at path: ${element.menu_address}`
                );
                // 可以在这里添加错误处理逻辑
            }
        });
    }
};