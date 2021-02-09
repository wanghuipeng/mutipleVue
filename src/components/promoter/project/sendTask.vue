<template>
  <div class="send-task-modal">
    <import-component from-flag="task" @reload="closeDrawer" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import importComponent from '@/components/promoter/promotion/importComponent';

export default {
  components: {
    importComponent
  },
  props: {
    operatorType: {
      type: String,
      default: ''
    },
    backTo: {
      type: String,
      default: ''
    },
    slotPage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: 1,
      loading: false,
      listData: []
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData
    })
  },
  watch: {
    dictData(val) {
      this.areas = this.dictData.areas
      this.areas.map(item => {
        item.children &&
          item.children.map(x => {
            x.children &&
              x.children.map(y => {
                delete y.children
              })
          })
      })
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    closeDrawer() {
      console.log(5555555555555)
      this.$emit('reload')
    }
  }
}
</script>

<style lang="scss" >
.send-task-modal{
    padding: 16px;
    .title{
        margin-bottom: 20px;
    }
   .upload-card{
       margin-bottom: 20px;
       background-color: #fff;
       padding: 16px;
       border-radius: 4px;
       border: 1px dashed #eee;
       .radios{
           margin: 15px 0;
       }
       .text{
           padding-left: 40px;
       }
       .title-1{
           color: #666;
           margin: 20px 0;
       }
       .content{
           font-size: 14px;
           p{
              margin-bottom: 10px;
           }
       }
       button{
           margin: 0px 0 10px 5px;
       }
   }
}
</style>
