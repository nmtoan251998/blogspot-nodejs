document.addEventListener("DOMContentLoaded", () => {
    const toolStacks = {
        'codeLangs': ['JavaScript', 'C', 'C++', 'PHP', 'Python', 'Go', 'Ruby', 'Java', 'C#'],
        'frontEnd': ['React.js', 'Vue.js', 'Angular.js', 'Bootstrap', 'Material UI', 'Skeleton'],
        'backEnd': ['Flask', 'Django', 'Express.js', 'Sail.js', 'CodeIgniter', 'Spring'],
        'softSkills': ['Leader', 'Teamwork', 'Communication', 'Problem solving', 'Critical thinking'],
        'languages': ['Vietnamese', 'English', 'Japanese', 'German', 'Franch', 'Chinese']
    };    
    let counter = 0;

    function getToolStackOnSelectChange(e) {                
        const pickedToolStack = e.target.value.toString().trim();
        let toolStackRenderer = '';
        toolStacks[pickedToolStack].forEach(htmlRendering => {
            toolStackRenderer += `<div class="form-group form-check tool-stack col-2" id="tool-stack-${counter}">
                                    <input type="checkbox" class="form-check-input" id="${htmlRendering}" name="${pickedToolStack}" value="${htmlRendering}">
                                    <label class="form-check-label" id="${htmlRendering}">${htmlRendering}</label>
                                </div>`;
        });

        let htmlRenderer = `<div class="row ml-2 mt-3" id="${pickedToolStack}-stack">${toolStackRenderer}</div>`;

        $(htmlRenderer).insertAfter(`#category-${counter}`);

        document.querySelectorAll('.category').forEach(selectEl => {
            selectEl.setAttribute('disabled', 'disabled');
        })                                           
        
        // remove the onChange event from the current selector
        document.querySelector(`#category-${counter}`).removeEventListener('change', getToolStackOnSelectChange);
    }
    document.querySelector(`#category-${counter}`).addEventListener('change', getToolStackOnSelectChange);        
    
    document.querySelector('#add-more').addEventListener('click', () => {
        counter++;
        let newCategoryPicker = `
            <hr/>
            <div class="category-picker">                
                <label for="title">Choose category</label><br/>                
                <select name="category" class="form-control category" id="category-${counter}">
                    <option value="">Choose tool stack</option>
                    <option value="codeLangs">Programming Languages</option>
                    <option value="frontEnd">Front-End Frameworks</option>
                    <option value="backEnd">Back-End Frameworks</option>
                    <option value="softSkills">Soft Skills</option>
                    <option value="languages">Languages</option>
                </select>                                    
            </div>`;

        $(newCategoryPicker).insertBefore('#add-more');        
        document.querySelector(`#category-${counter}`).addEventListener('change', getToolStackOnSelectChange);
    })
})