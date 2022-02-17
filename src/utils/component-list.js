class ComponentList {

    static components = {};

    static getContainers() {
        let containers = [];
        for (let uid of Object.keys(ComponentList.components)) {
            let helper = ComponentList.components[uid];
            if (helper.component.type === 'CONTAINER' && helper.hasChildren())
                containers.push(helper);
        }
        return containers;
    }

    static getModels() {
        return Object.values(ComponentList.components).filter(helper => helper.component.type === 'MODEL');
    }

    static getOrdered() {
        let components = [];
        let containers = ComponentList.getContainers();
        for (let container of containers) {
            if (!components.includes(container))
                components.push(container);
            for (let child of container.getChildren())
                components.push(child);
        }

        for (let component of Object.values(ComponentList.components)) {
            if (!components.includes(component))
                components.push(component);
        }
        return components;
    }

}

export default ComponentList;