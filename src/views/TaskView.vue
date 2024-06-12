<template>

  <div class="common-layout" style="height: 500px; ">  
    <el-container>
     
      <el-aside width="120px">
        <el-scrollbar>
          <el-menu> 
        
            <el-menu-item >任务管理</el-menu-item>
            <el-menu-item >其它</el-menu-item>
              
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main>

        <!-- 表单 -->
        <el-form :ref="formInlineRef" :inline="true" :model="formInline"  class="demo-form-inline">
          <el-form-item label="名称">
            <el-input v-model="formInline.taskName" placeholder="请输入任务名称" clearable />
          </el-form-item>

          <el-form-item label="编码">
            <el-input v-model="formInline.taskCode" placeholder="请输入任务编码" clearable />
          </el-form-item>

          <el-form-item label="创建时间">
            <el-date-picker
              v-model="formInline.createTime"
              type="datetimerange"
              range-separator="To"
              start-placeholder="最早时间"
              end-placeholder="最晚时间"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="default" @click="onQuery">查询</el-button>
          </el-form-item>
        </el-form>


        <!-- 新增按钮 -->
        
        <el-button type="primary" style="width: 100%"  @click="() => { addDialog = true; }">
          新增任务
        </el-button>
        <el-dialog v-model="addDialog" title="新增" width="500">

        <el-form :model="addForm" label-width="auto" style="max-width: 600px">
          <el-form-item label="任务名称">
            <el-input v-model="addForm.name" />
          </el-form-item>

          <el-form-item>
            <el-button @click="addDialog = false">取消</el-button>
            <el-button type="primary"  @click="() => { addDialog = false; onAddItem(); }"> 确定  </el-button>
          </el-form-item>
        </el-form>

      </el-dialog>



        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="name" label="名称" width="180" />
          <el-table-column prop="code" label="编码" width="180" />
          <el-table-column prop="create_time" label="创建时间" width="180" />
          <el-table-column prop="update_time" label="更新时间" width="180" />

          <el-table-column label="操作">
            <template #default="{row}">

              <el-button size="small" type="" plain  @click="() => { editDialog = true; id = row.id;  editForm.name = row.name}"> 编辑 </el-button>
                <el-dialog v-model="editDialog" title="编辑" width="500">

                  <el-form :model="editForm" label-width="auto" style="max-width: 600px">
                    <el-form-item label="任务名称">
                      <el-input v-model="editForm.name" />
                    </el-form-item>

                    <el-form-item>
                      <el-button @click="editDialog = false">取消</el-button>
                      <el-button type="primary"  @click="() => { editDialog = false; handleEdit(id); }"> 确定  </el-button>
                    </el-form-item>
                  </el-form>

                </el-dialog>

              <el-button size="small" type="warning" plain  @click="() => { deleteDialog = true; id = row.id; name=row.name}"> 删除 </el-button>
                <el-dialog v-model="deleteDialog" title="删除" width="500">
                  <span>确定删除 {{name}} 任务吗？</span>
                  <!-- <template #footer> -->
                  <div class="dialog-footer">
                    <el-button @click="deleteDialog = false">取消</el-button>
                    <el-button type="primary"  @click="() => { deleteDialog = false; handleDelete(id); }"> 确定  </el-button>
                  </div>
                  <!-- </template> -->
                </el-dialog>
            </template>
            

          </el-table-column>

        </el-table>
     
      </el-main>
    
    </el-container>
  </div>

</template>


<script lang="ts" setup>

import axios from 'axios'
import dayjs from "dayjs"
import { onMounted, reactive, ref, onUpdated, onUnmounted  } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

const url_head = 'http://localhost:8080'


// 表格内容
const tableData = ref([]) // 列表的数据

// 更新表格数据
const getList = () => {
  // 发送异步请求，获取数据
  axios.get(url_head+"/taskdto/current").then((result) => {
    tableData.value = result.data.data
  })
}


// 行内查询表单
const formInlineRef = ref<FormInstance>()
const formInline = reactive({
  taskName: '',
  taskCode: '',
  createTime: [],
})

const onQuery = () => {
  // console.log('query!')
  // alert("查询数据")
  // 将表单数据转换为查询参数
  const params = new URLSearchParams();
  params.append('name', formInline.taskName);
  params.append('code', formInline.taskCode);
  if (formInline.createTime && formInline.createTime.length == 2) {
    params.append('startDate', dayjs(formInline.createTime[0]).format('YYYY-MM-DD HH:mm:ss'));
    params.append('endDate', dayjs(formInline.createTime[1]).format('YYYY-MM-DD HH:mm:ss'));
  }
  console.log('params:')
  console.log(params)

  // 发送 GET 请求
  axios.get(url_head + '/taskdto/query', { params })
    .then((result) => {
      // 将返回的数据设置为 tableData
      tableData.value = result.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
}




// 编辑条目
const id = ref(null)  // 添加一个响应式引用来存储当前的 ID
const editDialog = ref(false)
const editForm = reactive({
  name: '',
})

const handleEdit = (id) => {
  console.log(id)
  console.log('Edit')
  const params = {
    name: editForm.name,  
  };
  console.log(editForm.name)

  axios.put(`${url_head}/task/${id}`, editForm.name, {headers:{'Content-Type':'text/plain'}})
    .then((result) => {
      console.log(result);
      getList();  // 更新成功后重新获取列表
    })
    .catch((error) => {
      console.error(error);
    });
}


// 删除条目，即修改为deleted=1
const deleteDialog = ref(false)

// 删除条目，即修改条目的deleted=1
const handleDelete = (id) => {
  // 发送 PUT 请求
  axios.put(`${url_head}/task/hide/${id}`)
    .then((result) => {
      console.log(result);
      getList();
    })
    .catch((error) => {
      console.error(error);
    });
}



// 新增条目
const addDialog = ref(false)
const addForm = reactive({
  name: '',
})

const onAddItem = () =>{
  console.log('Add')
  // 创建一个对象来存储请求数据
  const params = {
    name: addForm.name,  
  };
  console.log(params)
  // 发送 POST 请求
  axios.post(url_head+"/task", params)
    .then((response) => {
      console.log(response);
      getList();  // 更新成功后重新获取列表
    })
    .catch((error) => {
      console.error(error);
    });
}


onMounted(() => {
  getList()
})
  
</script>


<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>


