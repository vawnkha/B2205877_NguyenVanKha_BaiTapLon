<template>
  <div class="input-group mb-3" style="max-width: 400px">
    <input
      type="text"
      class="form-control"
      placeholder="Nhập để tìm kiếm"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('submit')"
    />
    <button class="btn btn-outline-secondary" @click="$emit('submit')">
      <i class="fa-solid fa-magnifying-glass"></i> Tìm
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue", "submit"],
};
</script>
