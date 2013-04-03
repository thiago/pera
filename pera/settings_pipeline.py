PIPELINE_CSS = {
    'core-styles': {
        'source_filenames': (
            'css/reset.less',
            'css/base.less',
            'css/layout.less',
            'css/module.less',
            'css/page.less',
            'css/state.less',
        ),
        'output_filename': 'compiled/css/core-styles.grouped.css',
        'extra_context': {
            'media': 'all',
        },
    },

    'ie-styles': {
        'source_filenames': (
            'css/ie.css',
        ),
        'output_filename': 'compiled/css/ie.grouped.css',
    }
}
