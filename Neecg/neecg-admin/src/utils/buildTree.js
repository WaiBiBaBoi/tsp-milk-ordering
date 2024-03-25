export function buildTree(items) {
    const rootItems = []; // 创建一个空数组，用于存储树的根节点（即那些没有父节点的项）
    const lookup = {}; // 创建一个空对象，用作查找表，方便我们通过id快速找到对应的节点引用

    // 遍历传入的items数组，该数组包含了要转成树状结构的节点信息
    for (const item of items) {
        const itemId = item['id']; // 获取当前遍历项的id
        const parentId = item['parent_id']; // 获取当前遍历项的父节点id

        // 如果查找表中没有当前项的id，则初始化该id对应的对象，并预置children数组
        if (!lookup[itemId]) lookup[itemId] = { ['children']: [] };

        // 更新查找表中的对象，将当前项的信息和已经存在的children数组合并
        lookup[itemId] = { ...item, ['children']: lookup[itemId]['children'] };

        // 获取当前项在查找表中的对象，这个对象可能已经有了children
        const TreeItem = lookup[itemId];

        // 如果parentId为空字符串，说明当前项没有父节点，是根节点
        if (parentId === '') {
            rootItems.push(TreeItem); // 将当前项添加到根节点数组中
        } else {
            // 如果当前项有父节点，我们需要处理两种情况
            if (!lookup[parentId]) lookup[parentId] = { ['children']: [] }; // 如果父节点不存在于查找表中，则先初始化父节点
            lookup[parentId]['children'].push(TreeItem); // 将当前项添加到其父节点的children数组中
        }
    }

    return rootItems; // 函数执行完后，返回包含完整树状结构的根节点数组
}