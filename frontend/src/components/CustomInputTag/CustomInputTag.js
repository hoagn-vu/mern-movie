import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../api/api';

import './CustomInputTag.css';

const CustomInputTag = ({ name, onUpdate, valueInput }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // const getItemsAPI = useCallback(async () => {
  //   try {
  //     const response = await api.get(`/${name}/get`);
  //     setItems(response.data);
  //     // console.log(response.data);
  //     if (valueInput) {
  //       for (let i = 0; i < valueInput.length; i++) {
  //         const existingItem = response.data.find(item => item._id.toString() === valueInput[i].toString());
  //         if (existingItem) {
  //           setSelectedItems(prevSelectedItems => [...prevSelectedItems, existingItem]);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching ${name}:`, error);
  //   }
  // }, [name]);
  // const getItemsAPI = useCallback(async () => {
  //   try {
  //     const response = await api.get(`/${name}/get`);
  //     setItems(response.data);
  
  //     if (valueInput) {
  //       setSelectedItems(prevSelectedItems => {
  //         const newSelectedItems = [...prevSelectedItems];
  //         const existingIds = new Set(prevSelectedItems.map(item => item._id.toString()));
  
  //         for (let i = 0; i < valueInput.length; i++) {
  //           const existingItem = response.data.find(
  //             item => item._id.toString() === valueInput[i].toString()
  //           );
  //           if (existingItem && !existingIds.has(existingItem._id.toString())) {
  //             newSelectedItems.push(existingItem);
  //             existingIds.add(existingItem._id.toString());
  //           }
  //         }
  //         return newSelectedItems;
  //       });
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching ${name}:`, error);
  //   }
  // }, [name, valueInput]);
  

  // useEffect(() => {
  //   getItemsAPI();

  // }, [getItemsAPI]);
  const [cachedItems, setCachedItems] = useState({}); // Cache cho từng `name`

  const getItemsAPI = useCallback(async () => {
    if (cachedItems[name]) {
      // Nếu đã có trong cache, không gọi API
      setItems(cachedItems[name]);
      processSelectedItems(cachedItems[name]);
      return;
    }

    try {
      const response = await api.get(`/${name}/get`);
      const fetchedItems = response.data;

      // Lưu vào cache
      setCachedItems(prevCache => ({ ...prevCache, [name]: fetchedItems }));
      setItems(fetchedItems);

      processSelectedItems(fetchedItems);
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
    }
  }, [name, cachedItems]);

  const processSelectedItems = useCallback(
    fetchedItems => {
      if (valueInput) {
        setSelectedItems(prevSelectedItems => {
          const newSelectedItems = [...prevSelectedItems];
          const existingIds = new Set(prevSelectedItems.map(item => item._id.toString()));

          valueInput.forEach(inputId => {
            const existingItem = fetchedItems.find(
              item => item._id.toString() === inputId.toString()
            );
            if (existingItem && !existingIds.has(existingItem._id.toString())) {
              newSelectedItems.push(existingItem);
              existingIds.add(existingItem._id.toString());
            }
          });

          return newSelectedItems;
        });
      }
    },
    [valueInput]
  );

  useEffect(() => {
    getItemsAPI();
  }, [getItemsAPI]);

  // useEffect(() => {
  //   if (valueInput) {
  //     for (let i = 0; i < valueInput.length; i++) {
  //       const existingItem = items.find(item => item._id === valueInput[i]);
  //       if (existingItem) {
  //         setSelectedItems(prevSelectedItems => [...prevSelectedItems, existingItem]);
  //       }
  //     }
  //     console.log("Selected Items in CustomInputTag:", selectedItems);
  //   }
  // }, [valueInput]);

  useEffect(() => {
    // console.log("Selected Items in CustomInputTag:", selectedItems);
    onUpdate(selectedItems);
  }, [selectedItems, onUpdate]);

  const isItemSelected = (item) => selectedItems.some(selected => selected._id === item._id);

  const filterDropdownItems = () => {
    const searchTerm = inputValue.toLowerCase();
    return items
      .filter(item => item.name.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        const aSelected = isItemSelected(a);
        const bSelected = isItemSelected(b);
        if (aSelected === bSelected) {
          return a.name.localeCompare(b.name);
        }
        return aSelected ? -1 : 1;
      });
  };

  const confirmDelete = async (id) => {
    const itemToDelete = items.find(item => item._id === id);
    if (itemToDelete && window.confirm(`Xác nhận xóa "${itemToDelete.name}"?`)) {
      try {
        await api.delete(`/${name}/delete/${id}`);
        setItems(prevItems => prevItems.filter(item => item._id !== id));
        setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item._id !== id));
        setTimeout(() => {
          inputRef.current.focus();
          setShowDropdown(true);
        }, 0);
      } catch (error) {
        console.error(`Error deleting ${name}:`, error);
      }
    }
  };

  const toggleItemSelection = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (isItemSelected(item)) {
        return prevSelectedItems.filter(selected => selected._id !== item._id);
      }
      return [...prevSelectedItems, item];
    });
  };

  const removeTag = (id) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(item => item._id !== id)
    );
  };

  const addTag = async (e) => {
    if (e.key === "Enter") {
      const tagName = e.target.value.trim();
      if (tagName) {
        const existingItem = items.find(i => i.name.toLowerCase() === tagName.toLowerCase());
        if (existingItem) {
          if (!isItemSelected(existingItem)) {
            setSelectedItems([...selectedItems, existingItem]);
          } else if (window.confirm(`"${tagName}" đã được chọn. Vẫn thêm mới?`)) {
            try {
              const newItem = { name: tagName };
              const response = await api.post(`/${name}/create`, newItem);
              setItems([...items, response.data]);
              setSelectedItems([...selectedItems, response.data]);
            } catch (error) {
              console.error(`Error adding ${name}:`, error);
            }
          }
        } else {
          try {
            const newItem = { name: tagName };
            const response = await api.post(`/${name}/create`, newItem);
            setItems([...items, response.data]);
            setSelectedItems([...selectedItems, response.data]);
          } catch (error) {
            console.error(`Error adding ${name}:`, error);
          }
        }
      }
      setInputValue('');
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && e.target !== inputRef.current) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  

  return (
    <div className="content-input-tag position-relative">
      <ul className="d-flex flex-wrap border rounded" id="ulTags">
        {selectedItems.slice(0, 4).map(tag => (
          <li key={tag._id} className="bg-light p-2 m-1 rounded d-flex align-items-center">
            {tag.name} <i className="fas fa-times d-flex align-items-center" onClick={() => removeTag(tag._id)}></i>
          </li>
        ))}
        {selectedItems.length > 4 && <li className="bg-light p-2 m-1 rounded">+{selectedItems.length - 4}</li>}
        <input
          id={name}
          type="text"
          ref={inputRef}
          value={inputValue}
          placeholder="Press Enter to add new"
          className="flex-grow-1 border-0 outline-0"
          onFocus={handleFocus}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addTag}
        />
      </ul>

      {showDropdown && (
        <div className="dropdown dropdown-input-tag show" ref={dropdownRef} style={{ position: 'absolute', width: '100%', top: '100%', zIndex: 1000 }}>
          {filterDropdownItems().map(item => (
            <div
              key={item._id}
              className="dropdown-item dropdown-item-input-tag d-flex justify-content-between align-items-center p-2"
            >
              <div className="d-flex align-items-center text-dark">
                <input
                  type="checkbox"
                  checked={isItemSelected(item)}
                  onChange={() => toggleItemSelection(item)}
                />
                <span>{item.name}</span>
              </div>
              <i className="fas fa-times text-dark" onClick={() => confirmDelete(item._id)}></i>
            </div>
          ))}
          {items.length === 0 && (
            <div className="dropdown-item dropdown-item-input-tag text-muted">Empty. Press Enter to add new tag.</div>
          )}
          {items.length !== 0 && filterDropdownItems().length === 0 && (
            <div className="dropdown-item dropdown-item-input-tag text-muted">No result match. Press Enter to add new tag.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomInputTag;
