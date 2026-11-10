<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
    <VerticalNavLink
        :item="{
            title: 'Users',
            to: '/users',
            icon: 'ri-user-2-line',
        }"
    />
    <VerticalNavLink
        :item="{
            title: 'Roles & Permissions',
            to: '/roles',
            icon: 'ri-shield-check-line',
        }"
    />
    <VerticalNavLink
        :item="{
            title: 'Settings',
            to: '/settings',
            icon: 'ri-settings-2-line',
        }"
    />
</template>
