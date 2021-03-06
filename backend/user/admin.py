from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (User, OTP, )
from .forms import (UserChangeForm, UserCreationForm, )


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    readonly_fields = ('date_joined', 'last_login',)

    list_display = ('email', 'first_name', 'last_name', 'staff', 'admin', 'is_employee', 'is_manager', 'is_rnd')
    list_filter = ('active', 'staff', 'admin', 'is_employee', 'is_manager', 'is_rnd', )
    fieldsets = (
        ('Login Info', {'fields': ('email', 'password')}),
        ('Primary Info', {'fields': ('first_name', 'last_name')}),
        ('Manager Info', {'fields': ('manager_id', )}),
        ('Employment Info', {'fields': ('is_employee', 'is_manager', 'is_rnd', )}),
        ('Permissions', {'fields': ('active', 'staff', 'admin', 'is_otp_verified')}),
        ('Time', {'fields': ('date_joined', 'last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name',)
    ordering = ('email', 'first_name', 'last_name',)
    filter_horizontal = ()


admin.site.site_header = 'Pulse-X'
admin.site.register(User, UserAdmin)
admin.site.register(OTP)
admin.site.unregister(Group)
