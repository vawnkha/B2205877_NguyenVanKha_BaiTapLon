<template>
  <div class="search-container mb-3" style="max-width: 400px; margin: auto">
    <div class="input-group shadow-sm rounded">
      <input
        type="text"
        class="form-control border-0"
        placeholder="Nhập để tìm kiếm"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="$emit('submit')"
      />
      <button
        class="btn btn-primary d-flex align-items-center"
        @click="$emit('submit')"
      >
        <i class="fa-solid fa-magnifying-glass me-2"></i> Tìm
      </button>
    </div>
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

<style scoped>
.search-container .input-group {
  transition: box-shadow 0.3s ease;
}

.search-container .input-group:focus-within {
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
