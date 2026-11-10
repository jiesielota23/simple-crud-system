<script setup>
    import { ref, watch, onMounted, onUnmounted, reactive } from 'vue';
    import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';

    import {
        requiredValidator,
        emailValidator,
        minLengthValidator,
        confirmedValidator,
    } from '@/utils/validators'

    const users = ref([]);
    const totalUsers = ref(0);
    const loading = ref(false);
    const alert = ref(false);
    const alertMessage = ref('');
    const alertType = ref('success');

    const page = ref(1);
    const itemsPerPage = ref(10);
    const search = ref('');

    const isFormValid = ref(false);
    const isUserDialogOpen = ref(false);
    const confirmationDialogOpen = ref(false);

    const isEditing = ref(false);

    const userForm = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation : ''
    });

    const headers = [
        {
            title: 'ID', key: 'id', sortable: false
        },
        {
            title: 'Name', key: 'name', sortable: false
        },
        {
            title: 'Email', key: 'email', sortable: false
        },
        {
            title: 'Date Created', key: 'created_at', sortable: false
        },
        {
            title: 'Actions', key: 'actions', sortable: false
        }
    ]

    let requestId = 0;
    let searchTimer = null;

    const fetchUsers = async() => {
        const currentRequest = ++requestId;

        loading.value = true;

        try {

            const response = await getUsers(
                page.value,
                itemsPerPage.value,
                search.value
            );

            if( currentRequest !== requestId ) return;

            users.value = response.data;
            totalUsers.value = response.total;

        } catch( error ) {
            if( currentRequest !== requestId ) return;
            console.error(error);
        } finally {
            if (currentRequest === requestId) {
                loading.value = false;
            }
        }
    }

    const saveUser = async() => {
        loading.value = true;
        alertMessage.value = '';

        try {
            const response = await createUser(userForm);

            if( response.success ) {
                isUserDialogOpen.value = false;
                fetchUsers();
                alert.value = true;
                alertMessage.value = `User ${response.data.name} was succcessfully added!`;
                alertType.value = 'success';
            }

        } catch(err) {
            if(err.response?.status === 422) {
                console.log(err.response.data.errors);
                alert.value = true;
                alertMessage.value = Object.values(err.response.data.errors).flat().join(' ');
                alertType.value = 'error';
            } else {
                alert.value = true;
                alertMessage.value = 'Failed to create user.';
                alertType.value = 'error';
            }
        } finally {
            isUserDialogOpen.value = false;
            loading.value = false;
        }

    }

    const openEditDialog = async( item ) => {
        isEditing.value = true;
        isUserDialogOpen.value = true;

        Object.assign(userForm, {
            id: item.id,
            name: item.name,
            email: item.email
        });

    }

    const editUser = async() => {

        try {
            const response = await updateUser(userForm.id, userForm);

            if( response.success ) {
                isUserDialogOpen.value = false;
                fetchUsers();
                alert.value = true;
                alertMessage.value = `User ${response.data.name} was updated successfully!`;
                alertType.value = 'success';
            }

        } catch(err) {
            if(err.response?.status === 422) {
                console.log(err.response.data.errors);
                alert.value = true;
                alertMessage.value = Object.values(err.response.data.errors).flat().join(' ');
                alertType.value = 'error';
            } else {
                alert.value = true;
                alertMessage.value = 'Failed to edit user.';
                alertType.value = 'error';
            }
            isUserDialogOpen.value = false;
        } finally {
            isUserDialogOpen.value = false;
        }
    }

    const openConfimationDialog = (item) => {
        confirmationDialogOpen.value = true;
        userForm.id = item.id;
    }

    const removeUser = async() => {

        try {
            await deleteUser(userForm.id);

            alert.value = true;
            alertMessage.value = 'User was successfully deleted!';
            alertType.value = 'success';
            fetchUsers();

        } catch(err) {
            if(err.response?.status === 422) {
                console.log(err.response.data.errors);
                alert.value = true;
                alertMessage.value = Object.values(err.response.data.errors).flat().join(' ');
                alertType.value = 'error';
            } else {
                alert.value = true;
                alertMessage.value = 'Failed to delete user.';
                alertType.value = 'error';
            }
        } finally {
            confirmationDialogOpen.value = false;
        }
    }

    watch(search, () => {
        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            page.value = 1;
            fetchUsers();
        }, 400);
    });

    onMounted(() => {
        fetchUsers();
    })


    onUnmounted(() => {
        clearTimeout(searchTimer)
        requestId++
    })

    const formatDate = date => {
        return date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
    }

    const resetForm = () => {
        Object.assign(userForm, {
            name: '',
            email: '',
            password: '',
            password_confirmation : ''
        });
    }


</script>
<template>
    <VAlert
        v-if="alert"
        :type="alertType"
        closable
        close-label="Close Alert"
        class="mb-5"
    >
        {{ alertMessage }}
    </VAlert>

    <!-- Data Tables -->
    <VCard>
        <VCardItem>
            <VCardTitle>Users</VCardTitle>
                <VCardSubtitle>
                    Manage system users
                </VCardSubtitle>
        </VCardItem>
        <VCardText>
            <VRow align="center">
                <VCol cols="12" md="6">
                    <VTextField
                        v-model="search"
                        label="Search users"
                        placeholder="Search name or email"
                        prepend-inner-icon="ri-search-line"
                        clearable
                        hide-details
                        density="compact"
                    />
                </VCol>

                <VCol cols="12" md="6" class="text-md-end">
                    <VBtn
                        @click="
                            isUserDialogOpen = true;
                            isEditing = false;
                            resetForm();
                        "
                        prepend-icon="ri-add-line"
                    >
                     Add User
                    </VBtn>
                </VCol>
            </VRow>
        </VCardText>
        <v-data-table-server
            :headers="headers"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :items-length="totalUsers"
            :items="users"
            item-value="id"
            loading-text="Loading... Please wait"
            :loading="loading"
            @update:options="fetchUsers"
        >
            <template #item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
            </template>
            <template #item.actions="{ item }">
                <VBtn
                    icon
                    variant="text"
                    size="small"
                    @click="openEditDialog(item)"
                    >
                    <VIcon icon="ri-pencil-line" />
                </VBtn>

                <VBtn
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="openConfimationDialog(item)"
                    >
                    <VIcon icon="ri-delete-bin-line" />
                </VBtn>
            </template>
        </v-data-table-server>
    </VCard>
    <!-- end Data Tables -->

     <!-- Dialog -->
      <VDialog
        v-model="isUserDialogOpen"
        max-width="500"
      >
        <VCard :title="isEditing ? `Editing User - ${userForm.name}` : 'Add User'">
            <VCardText>
                <VForm v-model="isFormValid" @submit.prevent>
                    <VRow>
                        <VCol cols="12">
                            <VTextField
                            v-model="userForm.name"
                            prepend-inner-icon="ri-user-line"
                            label="Full Name"
                            placeholder="Full Name"
                            :rules="[requiredValidator]"
                            />
                        </VCol>

                        <VCol cols="12">
                            <VTextField
                            v-model="userForm.email"
                            prepend-inner-icon="ri-mail-line"
                            label="Email"
                            type="email"
                            placeholder="johndoe@example.com"
                            :rules="[requiredValidator, emailValidator]"
                            />
                        </VCol>

                        <VCol cols="12" v-if="!isEditing">
                            <VTextField
                            v-model="userForm.password"
                            prepend-inner-icon="ri-lock-line"
                            label="Password"
                            autocomplete="on"
                            type="password"
                            placeholder=""
                            :rules="[requiredValidator, minLengthValidator(8)]"
                            />
                        </VCol>



                        <VCol cols="12" v-if="!isEditing">
                            <VTextField
                            v-model="userForm.password_confirmation "
                            prepend-inner-icon="ri-lock-line"
                            label="Confirm Password"
                            autocomplete="on"
                            type="password"
                            placeholder=""
                            :rules="[
                                requiredValidator,
                                confirmedValidator(() => userForm.password),
                            ]"
                            />
                        </VCol>

                        <VCol cols="12">
                            <VBtn
                            type="submit"
                            class="me-4"
                            @click="isEditing ? editUser() : saveUser()"
                            :disabled="!isFormValid"
                            >
                            {{ isEditing ? 'Update' : 'Add User' }}
                            </VBtn>

                            <VBtn
                                color="secondary"
                                type="reset"
                                variant="tonal"
                                @click="resetForm"
                            >
                            Reset
                            </VBtn>
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>
        </VCard>
      </VDialog>
     <!-- end Dialog -->

    <!-- Confirmation Dialog -->
     <VDialog
        v-model="confirmationDialogOpen"
        persistent
        class="v-dialog-sm"
    >
        <!-- Dialog Content -->
        <VCard class="text-center" title="Are you sure you want to Delete?">
        <v-card-actions class="justify-center">
            <VBtn
                color="success"
                @click="removeUser"
            >
                Confirm
            </VBtn>
            <VBtn
                color="error"
                @click="confirmationDialogOpen = false"
            >
                Cancel
            </VBtn>
        </v-card-actions>
        </VCard>
    </VDialog>
    <!-- end Confirmation Dialog -->
</template>
