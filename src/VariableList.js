import React, { useState } from 'react';
import './VariableList.css';



function VariableList({ handleSetVars, setVariables, variables }) {
    const [editSelect, setEditSelect] = useState(-1);

    const addItem = () => {
        setVariables([...variables, { name: "variable " + variables.length.toString(), type: 'int', value: 0, defaultValue: 0 }]);
        handleSetVars(variables);
    };

    const removeItem = (index) => {
        setVariables(variables.filter((_, i) => i !== index));
        setEditSelect(-1);
        handleSetVars(variables);
    };

    
    const resetVariables = () => {
        const newVariables = variables.map((currentItem) => {
            return { ...currentItem, value: currentItem.defaultValue };
        });

        setVariables();
        handleSetVars(newVariables);
    };

    const resetItem = (index) => {
        const newVariables = variables.map((currentItem) => {
            if (currentItem === item) {
                try {
                    if (item.type != "float")
                        return { ...currentItem, value: currentItem.defaultValue };
                    else
                        return { ...currentItem, value: currentItem.defaultValue };
                } catch (e) { }
            }
            return currentItem;
        });

        setVariables(newVariables);
        handleSetVars(newVariables);
    };

    const drawItem = (item, index) => {
        
        let valueField = (<input
            type="text"
            value={item.defaultValue}
            onChange={(e) => {
                const newVariables = variables.map((currentItem) => {
                    if (currentItem === item) {
                        return { ...currentItem, defaultValue: e.target.value, value: e.target.value };
                    }
                    return currentItem;
                });
            
                setVariables(newVariables);
                handleSetVars(newVariables);
            }}
            placeholder="Default Value"
        />);
        if (item.type != "string")
            valueField = (<input
                type="number"
                value={item.defaultValue}
                onChange={(e) => {
                    const newVariables = variables.map((currentItem) => {
                        if (currentItem === item) {
                            try {
                                if (item.type != "float")
                                    return { ...currentItem, defaultValue: parseInt(e.target.value), value: parseInt(e.target.value) };
                                else
                                    return { ...currentItem, defaultValue: parseFloat(e.target.value), value: parseFloat(e.target.value) };
                            } catch (e) { }
                        }
                        return currentItem;
                    });
                
                    setVariables(newVariables);
                    handleSetVars(newVariables);
                }}
                placeholder="Default Value"
            />);

        if (editSelect == index) {
            return (
                <div key={index}>
                    <div class="variable-list-item" onClick={() => setEditSelect(-1)}>
                        {item.type} {item.name} = {item.value} <br/>
                    </div>
                    <div class="variable-list-edit">
                        Name: <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                                const newVariables = variables.map((currentItem) => {
                                    if (currentItem === item) {
                                        return { ...currentItem, name: e.target.value };
                                    }
                                    return currentItem;
                                });
                            
                                setVariables(newVariables);
                                handleSetVars(newVariables);
                            }}
                            placeholder="Item Name"
                        /> <br/>
                        Type: <select
                            value={item.type}
                            onChange={(e) => {
                                const newVariables = variables.map((currentItem) => {
                                    if (currentItem === item) {
                                        if (e.target.value == "string")
                                            return { ...currentItem, type: e.target.value, value: "", defaultValue: "" };
                                        else
                                            return { ...currentItem, type: e.target.value, value: 0, defaultValue: 0 };
                                    }
                                    return currentItem;
                                });
                            
                                setVariables(newVariables);
                                handleSetVars(newVariables);
                            }}
                        >
                            <option value="int">int</option>
                            <option value="float">float</option>
                            <option value="string">string</option>
                        </select>
                        {valueField}
                        <button onClick={() => resetItem(index)}>Reset</button>
                        <button onClick={() => removeItem(index)}>Delete</button>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div class="variable-list-item" key={index} onClick={() => setEditSelect(index)}>
                    {item.type} {item.name} = {item.value} <br/>
                </div>
            );
        }
    }
    
    return (
        <div class="variable-list-body">
            <div>
                <button class="send-button" onClick={addItem}>Add New Variable</button>
            </div>
            <div>
                {variables.map((item, index) => drawItem(item, index))}
            </div>
            <button class="send-button" onClick={resetVariables}>Reset Variables</button>
        </div>
    );

    /*
    return (
        <div class="variable-list-body">
            <div>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item Name"
                />
                <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                >
                    <option value="int">int</option>
                    <option value="float">float</option>
                    <option value="string">string</option>
                </select>
                <button onClick={addItem}>Add Item</button>
            </div>
            <ul>
                {variables.map((item, index) => (
                    <li key={index}>
                        {item.name} ({item.type})
                        <button onClick={() => removeItem(index)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
    */
}

export default VariableList;
